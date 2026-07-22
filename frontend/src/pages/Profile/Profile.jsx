import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  AlertTriangle,
  Database,
  Download,
  Edit3,
  Heart,
  KeyRound,
  LogOut,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";

import Container from "../../components/common/Container/Container";
import Button from "../../components/common/Button/Button";
import Toast from "../../components/common/Toast/Toast";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import {
  getFavorites,
} from "../../services/favoritesService";

import {
  removeNasaApiKey,
  updateNasaApiKey,
} from "../../services/profileService";

import useAuth from "../../hooks/useAuth";

import "./Profile.css";

const TABS = [
  {
    id: "profile",
    label: "O meu perfil",
    icon: User,
  },
  {
    id: "nasa-key",
    label: "Chave NASA",
    icon: KeyRound,
  },
  {
    id: "download",
    label: "Descarregar dados",
    icon: Download,
  },
  {
    id: "delete",
    label: "Eliminar conta",
    icon: Trash2,
    danger: true,
  },
  {
    id: "logout",
    label: "Terminar sessão",
    icon: LogOut,
  },
];

function getInitials(name = "") {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "SV";
  }

  return parts
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function formatMemberDate(date) {
  if (!date) {
    return "Data não disponível";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data não disponível";
  }

  return new Intl.DateTimeFormat("pt-PT", {
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function getApiErrorMessage(
  error,
  fallbackMessage
) {
  const validationErrors =
    error.response?.data?.errors;

  const firstValidationError =
    validationErrors &&
    Object.values(validationErrors)
      .flat()
      .find(Boolean);

  return (
    firstValidationError ||
    error.response?.data?.message ||
    fallbackMessage
  );
}

function Profile() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    isAuthLoading,
    logout,
    updateProfile,
    updateLocalUser,
    deleteAccount,
  } = useAuth();

  const [activeTab, setActiveTab] =
    useState("profile");

  const [isEditing, setIsEditing] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [formError, setFormError] =
    useState("");

  const [isSavingProfile, setIsSavingProfile] =
    useState(false);

  const [toast, setToast] = useState("");
  const [toastType, setToastType] =
    useState("success");

  const [favorites, setFavorites] =
    useState([]);

  const [
    isLoadingFavorites,
    setIsLoadingFavorites,
  ] = useState(true);

  const [isDownloading, setIsDownloading] =
    useState(false);

  const [nasaApiKey, setNasaApiKey] =
    useState("");

  const [nasaKeyError, setNasaKeyError] =
    useState("");

  const [
    isSavingNasaKey,
    setIsSavingNasaKey,
  ] = useState(false);

  const [
    isRemovingNasaKey,
    setIsRemovingNasaKey,
  ] = useState(false);

  const [deleteConfirm, setDeleteConfirm] =
    useState("");

  const [deletePassword, setDeletePassword] =
    useState("");

  const [deleteError, setDeleteError] =
    useState("");

  const [
    isDeletingAccount,
    setIsDeletingAccount,
  ] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return undefined;
    }

    let isMounted = true;

    async function loadFavorites() {
      try {
        setIsLoadingFavorites(true);

        const result = await getFavorites();

        if (isMounted) {
          setFavorites(
            Array.isArray(result)
              ? result
              : []
          );
        }
      } catch (error) {
        console.error(
          "Não foi possível carregar os favoritos:",
          error
        );

        if (isMounted) {
          setFavorites([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingFavorites(false);
        }
      }
    }

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user]);

  const favoriteTypes = useMemo(() => {
    const types = new Set(
      favorites
        .map(
          (favorite) =>
            favorite.nasa_type ||
            favorite.source ||
            favorite.type
        )
        .filter(Boolean)
    );

    return types.size;
  }, [favorites]);

  const userInitials = useMemo(
    () => getInitials(user?.name),
    [user?.name]
  );

  const accountType =
    user?.role === "admin"
      ? "Administrador"
      : "Utilizador";

  const memberSince = formatMemberDate(
    user?.created_at
  );

  if (isAuthLoading) {
    return (
      <main className="profile-page">
        <Container>
          <div className="profile-loading">
            <div className="profile-loading__avatar" />

            <div>
              <p>A carregar perfil...</p>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: "/profile" }}
      />
    );
  }

  function showToast(
    message,
    type = "success"
  ) {
    setToast(message);
    setToastType(type);

    window.setTimeout(() => {
      setToast("");
    }, 3000);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function handleStartEditing() {
    setFormData({
      name: user.name || "",
      email: user.email || "",
    });

    setFormError("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setFormData({
      name: user.name || "",
      email: user.email || "",
    });

    setFormError("");
    setIsEditing(false);
  }

  async function handleSaveProfile(event) {
    event.preventDefault();

    setFormError("");

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name || !email) {
      setFormError(
        "Preenche o nome e o email."
      );
      return;
    }

    try {
      setIsSavingProfile(true);

      const response =
        await updateProfile({
          name,
          email,
        });

      setFormData({
        name: response.user.name,
        email: response.user.email,
      });

      setIsEditing(false);

      showToast(
        response.message ||
          "Perfil atualizado com sucesso."
      );
    } catch (error) {
      setFormError(
        getApiErrorMessage(
          error,
          "Não foi possível atualizar o perfil."
        )
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleSaveNasaApiKey(
    event
  ) {
    event.preventDefault();

    const trimmedKey = nasaApiKey.trim();

    setNasaKeyError("");

    if (!trimmedKey) {
      setNasaKeyError(
        "Introduz uma chave da API NASA."
      );
      return;
    }

    try {
      setIsSavingNasaKey(true);

      const response =
        await updateNasaApiKey(
          trimmedKey
        );

      updateLocalUser({
        has_nasa_api_key:
          response.has_nasa_api_key,
      });

      setNasaApiKey("");

      showToast(
        response.message ||
          "Chave da NASA guardada com sucesso."
      );
    } catch (error) {
      setNasaKeyError(
        getApiErrorMessage(
          error,
          "Não foi possível guardar a chave da NASA."
        )
      );
    } finally {
      setIsSavingNasaKey(false);
    }
  }

  async function handleRemoveNasaApiKey() {
    const confirmed = window.confirm(
      "Pretendes remover a tua chave pessoal da NASA? A aplicação passará a utilizar a chave geral do SpaceVision."
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsRemovingNasaKey(true);
      setNasaKeyError("");

      const response =
        await removeNasaApiKey();

      updateLocalUser({
        has_nasa_api_key:
          response.has_nasa_api_key,
      });

      setNasaApiKey("");

      showToast(
        response.message ||
          "Chave da NASA removida com sucesso."
      );
    } catch (error) {
      setNasaKeyError(
        getApiErrorMessage(
          error,
          "Não foi possível remover a chave da NASA."
        )
      );
    } finally {
      setIsRemovingNasaKey(false);
    }
  }

  async function handleDownloadData() {
    try {
      setIsDownloading(true);

      const updatedFavorites =
        await getFavorites();

      const exportData = {
        exportedAt:
          new Date().toISOString(),

        profile: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
          createdAt:
            user.created_at || null,
          hasNasaApiKey:
            Boolean(
              user.has_nasa_api_key
            ),
        },

        favorites: Array.isArray(
          updatedFavorites
        )
          ? updatedFavorites
          : [],
      };

      const blob = new Blob(
        [
          JSON.stringify(
            exportData,
            null,
            2
          ),
        ],
        {
          type: "application/json",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        `spacevision-dados-${user.id}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      showToast("Download iniciado.");
    } catch (error) {
      console.error(
        "Erro ao descarregar dados:",
        error
      );

      showToast(
        "Não foi possível descarregar os dados.",
        "error"
      );
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleDeleteAccount(
    event
  ) {
    event.preventDefault();

    setDeleteError("");

    if (
      deleteConfirm.trim() !==
      "ELIMINAR"
    ) {
      setDeleteError(
        'Escreve "ELIMINAR" para confirmar a eliminação da conta.'
      );
      return;
    }

    if (!deletePassword.trim()) {
      setDeleteError(
        "Introduz a tua palavra-passe atual para confirmar."
      );
      return;
    }

    const confirmed = window.confirm(
      "Tens a certeza de que pretendes eliminar permanentemente a tua conta? Esta ação não pode ser anulada."
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeletingAccount(true);

      const response =
        await deleteAccount(
          deletePassword
        );

      navigate("/", {
        replace: true,
        state: {
          message:
            response.message ||
            "Conta eliminada com sucesso.",
        },
      });
    } catch (error) {
      setDeleteError(
        getApiErrorMessage(
          error,
          "Não foi possível eliminar a conta."
        )
      );
    } finally {
      setIsDeletingAccount(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  async function handleTabClick(tab) {
    if (tab.id === "logout") {
      await handleLogout();
      return;
    }

    setFormError("");
    setDeleteError("");
    setNasaKeyError("");

    if (tab.id !== "delete") {
      setDeleteConfirm("");
      setDeletePassword("");
    }

    if (tab.id !== "nasa-key") {
      setNasaApiKey("");
    }

    setActiveTab(tab.id);
  }

  return (
    <>
      <PageMeta
        title="Perfil — SpaceVision"
        description="Gere os teus dados pessoais, favoritos e preferências da conta no SpaceVision."
      />

      <main className="profile-page">
        <Container>
          <Breadcrumb title="Perfil" />

          <section className="profile-hero">
            <div className="profile-hero__identity">
              <div
                className="profile-hero__avatar"
                aria-hidden="true"
              >
                {userInitials}
              </div>

              <div className="profile-hero__content">
                <p className="profile-page__label">
                  Área pessoal
                </p>

                <h1>{user.name}</h1>

                <p className="profile-hero__email">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="profile-hero__account">
              <span className="profile-hero__badge">
                <ShieldCheck
                  size={16}
                  aria-hidden="true"
                />

                {accountType}
              </span>

              <p>
                Membro da comunidade SpaceVision
              </p>
            </div>
          </section>

          <section
            className="profile-stats"
            aria-label="Resumo da conta"
          >
            <article className="profile-stat-card">
              <div className="profile-stat-card__icon">
                <Heart
                  size={21}
                  aria-hidden="true"
                />
              </div>

              <div>
                <strong>
                  {isLoadingFavorites
                    ? "—"
                    : favorites.length}
                </strong>

                <span>
                  Favoritos guardados
                </span>
              </div>
            </article>

            <article className="profile-stat-card">
              <div className="profile-stat-card__icon">
                <Database
                  size={21}
                  aria-hidden="true"
                />
              </div>

              <div>
                <strong>
                  {isLoadingFavorites
                    ? "—"
                    : favoriteTypes}
                </strong>

                <span>
                  Fontes exploradas
                </span>
              </div>
            </article>

            <article className="profile-stat-card">
              <div className="profile-stat-card__icon">
                <ShieldCheck
                  size={21}
                  aria-hidden="true"
                />
              </div>

              <div>
                <strong>
                  {accountType}
                </strong>

                <span>
                  Tipo de conta
                </span>
              </div>
            </article>

            <article className="profile-stat-card">
              <div className="profile-stat-card__icon">
                <User
                  size={21}
                  aria-hidden="true"
                />
              </div>

              <div>
                <strong>
                  {memberSince}
                </strong>

                <span>
                  Membro desde
                </span>
              </div>
            </article>
          </section>

          {toast && (
            <Toast
              message={toast}
              type={toastType}
            />
          )}

          <section className="profile-workspace">
            <nav
              className="profile-sidebar"
              aria-label="Secções do perfil"
            >
              <div className="profile-sidebar__heading">
                <span>
                  Definições da conta
                </span>
              </div>

              {TABS.map((tab) => {
                const TabIcon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={[
                      "profile-sidebar__tab",
                      activeTab === tab.id
                        ? "profile-sidebar__tab--active"
                        : "",
                      tab.danger
                        ? "profile-sidebar__tab--danger"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() =>
                      handleTabClick(tab)
                    }
                    aria-current={
                      activeTab === tab.id
                        ? "page"
                        : undefined
                    }
                  >
                    <TabIcon
                      size={18}
                      aria-hidden="true"
                    />

                    <span>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="profile-content">
              {activeTab === "profile" && (
                <article className="profile-card">
                  <header className="profile-card__header">
                    <div className="profile-card__title-group">
                      <div className="profile-feature__icon">
                        <User
                          size={30}
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <p className="profile-page__label">
                          Dados pessoais
                        </p>

                        <h2>
                          Informação da conta
                        </h2>

                        <p className="profile-card__intro">
                          Consulta e gere os
                          dados associados à tua
                          conta SpaceVision.
                        </p>
                      </div>
                    </div>

                    {!isEditing && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={
                          handleStartEditing
                        }
                      >
                        <Edit3
                          size={17}
                          aria-hidden="true"
                        />

                        Editar
                      </Button>
                    )}
                  </header>

                  <form
                    className="profile-form"
                    onSubmit={
                      handleSaveProfile
                    }
                  >
                    <div className="profile-form__grid">
                      <div className="profile-form__field">
                        <label htmlFor="name">
                          Nome
                        </label>

                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={
                            isEditing
                              ? formData.name
                              : user.name || ""
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            !isEditing
                          }
                          autoComplete="name"
                        />
                      </div>

                      <div className="profile-form__field">
                        <label htmlFor="email">
                          Email
                        </label>

                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={
                            isEditing
                              ? formData.email
                              : user.email || ""
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            !isEditing
                          }
                          autoComplete="email"
                        />
                      </div>

                      <div className="profile-form__field">
                        <label htmlFor="role">
                          Tipo de conta
                        </label>

                        <input
                          id="role"
                          type="text"
                          value={
                            accountType
                          }
                          disabled
                        />
                      </div>

                      <div className="profile-form__field">
                        <label htmlFor="memberSince">
                          Membro desde
                        </label>

                        <input
                          id="memberSince"
                          type="text"
                          value={
                            memberSince
                          }
                          disabled
                        />
                      </div>
                    </div>

                    {formError && (
                      <p
                        className="profile-error"
                        role="alert"
                      >
                        {formError}
                      </p>
                    )}

                    {isEditing && (
                      <div className="profile-form__actions">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={
                            isSavingProfile
                          }
                        >
                          {isSavingProfile
                            ? "A guardar..."
                            : "Guardar alterações"}
                        </Button>

                        <Button
                          type="button"
                          variant="secondary"
                          onClick={
                            handleCancelEdit
                          }
                          disabled={
                            isSavingProfile
                          }
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </form>
                </article>
              )}

              {activeTab === "nasa-key" && (
                <article className="profile-card">
                  <div className="profile-feature">
                    <div className="profile-feature__icon">
                      <KeyRound
                        size={30}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="profile-feature__content">
                      <p className="profile-page__label">
                        Integração NASA
                      </p>

                      <h2>
                        Chave pessoal da API NASA
                      </h2>

                      <p className="profile-card__intro">
                        Adiciona uma chave
                        pessoal para utilizar os
                        teus próprios limites de
                        pedidos às APIs da NASA.
                      </p>

                      <div
                        className={[
                          "profile-nasa-key-status",
                          user.has_nasa_api_key
                            ? "profile-nasa-key-status--active"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        role="status"
                      >
                        <ShieldCheck
                          size={18}
                          aria-hidden="true"
                        />

                        <span>
                          {user.has_nasa_api_key
                            ? "Chave pessoal configurada"
                            : "A utilizar a chave geral do SpaceVision"}
                        </span>
                      </div>

                      <form
                        className="profile-form"
                        onSubmit={
                          handleSaveNasaApiKey
                        }
                      >
                        <div className="profile-form__field">
                          <label htmlFor="nasaApiKey">
                            NASA API Key
                          </label>

                          <input
                            id="nasaApiKey"
                            name="nasaApiKey"
                            type="password"
                            value={
                              nasaApiKey
                            }
                            onChange={(
                              event
                            ) => {
                              setNasaApiKey(
                                event.target
                                  .value
                              );

                              if (
                                nasaKeyError
                              ) {
                                setNasaKeyError(
                                  ""
                                );
                              }
                            }}
                            placeholder={
                              user.has_nasa_api_key
                                ? "Introduz uma nova chave para substituir a atual"
                                : "Introduz a tua NASA API Key"
                            }
                            autoComplete="off"
                            spellCheck="false"
                            disabled={
                              isSavingNasaKey ||
                              isRemovingNasaKey
                            }
                          />

                          <p className="profile-form__help">
                            A chave será guardada
                            de forma encriptada e
                            não será apresentada
                            novamente.
                          </p>
                        </div>

                        {nasaKeyError && (
                          <p
                            className="profile-error"
                            role="alert"
                          >
                            {nasaKeyError}
                          </p>
                        )}

                        <div className="profile-form__actions">
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={
                              isSavingNasaKey ||
                              isRemovingNasaKey
                            }
                          >
                            {isSavingNasaKey
                              ? "A validar e guardar..."
                              : user.has_nasa_api_key
                                ? "Substituir chave"
                                : "Guardar chave"}
                          </Button>

                          {user.has_nasa_api_key && (
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={
                                handleRemoveNasaApiKey
                              }
                              disabled={
                                isSavingNasaKey ||
                                isRemovingNasaKey
                              }
                            >
                              {isRemovingNasaKey
                                ? "A remover..."
                                : "Remover chave"}
                            </Button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </article>
              )}

              {activeTab === "download" && (
                <article className="profile-card">
                  <div className="profile-feature">
                    <div className="profile-feature__icon">
                      <Download
                        size={30}
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      <p className="profile-page__label">
                        Exportação
                      </p>

                      <h2>
                        Descarregar os meus dados
                      </h2>

                      <p className="profile-card__intro">
                        Cria uma cópia em
                        formato JSON com os
                        dados da conta e os
                        favoritos guardados.
                      </p>

                      <Button
                        variant="primary"
                        onClick={
                          handleDownloadData
                        }
                        disabled={
                          isDownloading
                        }
                      >
                        <Download
                          size={17}
                          aria-hidden="true"
                        />

                        {isDownloading
                          ? "A preparar download..."
                          : "Descarregar dados"}
                      </Button>
                    </div>
                  </div>
                </article>
              )}

              {activeTab === "delete" && (
                <article className="profile-card profile-card--danger">
                  <div className="profile-feature">
                    <div className="profile-feature__icon profile-feature__icon--danger">
                      <AlertTriangle
                        size={30}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="profile-feature__content">
                      <p className="profile-page__label profile-page__label--danger">
                        Zona de perigo
                      </p>

                      <h2>
                        Eliminar conta e dados
                      </h2>

                      <p className="profile-card__intro">
                        Esta ação irá eliminar
                        permanentemente a conta
                        e os dados associados.
                        Não poderá ser desfeita.
                      </p>

                      <form
                        className="profile-form"
                        onSubmit={
                          handleDeleteAccount
                        }
                      >
                        <div className="profile-form__field">
                          <label htmlFor="deleteConfirm">
                            Escreve{" "}
                            <strong>
                              ELIMINAR
                            </strong>{" "}
                            para confirmar
                          </label>

                          <input
                            id="deleteConfirm"
                            name="deleteConfirm"
                            type="text"
                            value={
                              deleteConfirm
                            }
                            onChange={(
                              event
                            ) =>
                              setDeleteConfirm(
                                event.target
                                  .value
                              )
                            }
                            placeholder="ELIMINAR"
                            autoComplete="off"
                            disabled={
                              isDeletingAccount
                            }
                          />
                        </div>

                        <div className="profile-form__field">
                          <label htmlFor="deletePassword">
                            Palavra-passe atual
                          </label>

                          <input
                            id="deletePassword"
                            name="deletePassword"
                            type="password"
                            value={
                              deletePassword
                            }
                            onChange={(
                              event
                            ) =>
                              setDeletePassword(
                                event.target
                                  .value
                              )
                            }
                            placeholder="Introduz a tua palavra-passe"
                            autoComplete="current-password"
                            disabled={
                              isDeletingAccount
                            }
                          />
                        </div>

                        {deleteError && (
                          <p
                            className="profile-error"
                            role="alert"
                          >
                            {deleteError}
                          </p>
                        )}

                        <Button
                          type="submit"
                          variant="danger"
                          disabled={
                            isDeletingAccount
                          }
                        >
                          <Trash2
                            size={17}
                            aria-hidden="true"
                          />

                          {isDeletingAccount
                            ? "A eliminar conta..."
                            : "Eliminar permanentemente"}
                        </Button>
                      </form>
                    </div>
                  </div>
                </article>
              )}
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}

export default Profile;