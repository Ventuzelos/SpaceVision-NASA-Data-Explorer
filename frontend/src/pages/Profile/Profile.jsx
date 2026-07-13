import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import Container from "../../components/common/Container/Container";
import Button from "../../components/common/Button/Button";
import Toast from "../../components/common/Toast/Toast";

import useAuth from "../../hooks/useAuth";

import {
  getFavorites,
} from "../../services/favoritesService";

import {
  getContactMessagesByEmail,
} from "../../services/messagesService";

import "./Profile.css";

const TABS = [
  {
    id: "profile",
    label: "O meu perfil",
  },
  {
    id: "download",
    label: "Descarregar os meus dados",
  },
  {
    id: "delete",
    label: "Eliminar conta",
    danger: true,
  },
  {
    id: "logout",
    label: "Terminar sessão",
  },
];

function Profile() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    isAuthLoading,
    logout,
  } = useAuth();

  const [activeTab, setActiveTab] =
    useState("profile");

  const [isEditing, setIsEditing] =
    useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [formError, setFormError] =
    useState("");

  const [toast, setToast] =
    useState("");

  const [isDownloading, setIsDownloading] =
    useState(false);

  const [deleteConfirm, setDeleteConfirm] =
    useState("");

  const [deleteError, setDeleteError] =
    useState("");

  if (isAuthLoading) {
    return (
      <section className="profile-page">
        <Container>
          <div className="profile-card">
            <p>A carregar perfil...</p>
          </div>
        </Container>
      </section>
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

  function showToast(message) {
    setToast(message);

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

  function handleSaveProfile(event) {
    event.preventDefault();

    setFormError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim()
    ) {
      setFormError(
        "Preenche o nome e o email."
      );

      return;
    }

    /*
     * A interface está preparada, mas o backend ainda
     * precisa de um endpoint de atualização do perfil.
     */
    setFormError(
      "A atualização do perfil ainda não está ligada ao backend."
    );
  }

  async function handleDownloadData() {
    try {
      setIsDownloading(true);

      const favorites = await getFavorites();

      let contactMessages = [];

      try {
        contactMessages =
          getContactMessagesByEmail(user.email) || [];
      } catch (messagesError) {
        console.error(
          "Não foi possível obter as mensagens:",
          messagesError
        );
      }

      const exportData = {
        exportedAt: new Date().toISOString(),

        profile: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
          createdAt:
            user.created_at || null,
        },

        favorites:
          Array.isArray(favorites)
            ? favorites
            : [],

        contactMessages:
          Array.isArray(contactMessages)
            ? contactMessages
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
        "Não foi possível descarregar os dados."
      );
    } finally {
      setIsDownloading(false);
    }
  }

  function handleDeleteAccount(event) {
    event.preventDefault();

    setDeleteError("");

    if (
      deleteConfirm
        .trim()
        .toUpperCase() !== "ELIMINAR"
    ) {
      setDeleteError(
        'Escreve "ELIMINAR" para confirmares.'
      );

      return;
    }

    /*
     * Ainda não existe uma função no authService
     * nem um endpoint Laravel para eliminar a conta.
     */
    setDeleteError(
      "A eliminação da conta ainda não está ligada ao backend."
    );
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

    setActiveTab(tab.id);
  }

  return (
    <section className="profile-page">
      <Container>
        <header className="profile-page__header">
          <p className="profile-page__label">
            Área pessoal
          </p>

          <h1>O meu perfil</h1>

          <p>
            Gere os teus dados e consulta a
            informação associada à tua conta.
          </p>
        </header>

        {toast && (
          <Toast
            message={toast}
            type="success"
          />
        )}

        <div className="profile-layout">
          <nav
            className="profile-sidebar"
            aria-label="Secções do perfil"
          >
            {TABS.map((tab) => (
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
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="profile-content">
            {activeTab === "profile" && (
              <div className="profile-card">
                <h2>
                  Dados do utilizador
                </h2>

                <p className="profile-card__intro">
                  Consulta a informação associada
                  à tua conta SpaceVision.
                </p>

                <form
                  className="profile-form"
                  onSubmit={handleSaveProfile}
                >
                  <div className="profile-form__field">
                    <label htmlFor="name">
                      Nome
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
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
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
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
                        user.role === "admin"
                          ? "Administrador"
                          : "Utilizador"
                      }
                      disabled
                    />
                  </div>

                  {formError && (
                    <p
                      className="profile-error"
                      role="alert"
                    >
                      {formError}
                    </p>
                  )}

                  <div className="profile-form__actions">
                    {!isEditing ? (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={
                          handleStartEditing
                        }
                      >
                        Editar dados
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="submit"
                          variant="primary"
                        >
                          Guardar alterações
                        </Button>

                        <Button
                          type="button"
                          variant="secondary"
                          onClick={
                            handleCancelEdit
                          }
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            )}

            {activeTab === "download" && (
              <div className="profile-card">
                <h2>
                  Descarregar os meus dados
                </h2>

                <p className="profile-card__intro">
                  Descarrega uma cópia dos dados
                  associados à tua conta, incluindo
                  o perfil e os favoritos guardados.
                </p>

                <Button
                  variant="primary"
                  onClick={
                    handleDownloadData
                  }
                  disabled={isDownloading}
                >
                  {isDownloading
                    ? "A preparar download..."
                    : "Descarregar dados (JSON)"}
                </Button>
              </div>
            )}

            {activeTab === "delete" && (
              <div className="profile-card profile-card--danger">
                <h2>
                  Eliminar conta e dados
                </h2>

                <p className="profile-card__intro">
                  Esta ação irá eliminar
                  permanentemente a conta e os
                  dados associados. Não poderá ser
                  desfeita.
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
                      value={deleteConfirm}
                      onChange={(event) =>
                        setDeleteConfirm(
                          event.target.value
                        )
                      }
                      placeholder="ELIMINAR"
                      autoComplete="off"
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
                    variant="secondary"
                  >
                    Eliminar a minha conta
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Profile;