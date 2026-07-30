import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import {
  Navigate,
  useNavigate,
} from "react-router";

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

const TOAST_TIMEOUT_MS = 3000;

const TABS = [
  {
    id: "profile",
    labelKey: "profile.tabs.profile",
    icon: User,
  },
  {
    id: "nasa-key",
    labelKey: "profile.tabs.nasaKey",
    icon: KeyRound,
  },
  {
    id: "download",
    labelKey: "profile.tabs.download",
    icon: Download,
  },
  {
    id: "delete",
    labelKey: "profile.tabs.delete",
    icon: Trash2,
    danger: true,
  },
  {
    id: "logout",
    labelKey: "profile.tabs.logout",
    icon: LogOut,
  },
];

function getInitials(
  name = ""
) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (
    parts.length === 0
  ) {
    return "SV";
  }

  return parts
    .map(
      (part) =>
        part.charAt(0)
    )
    .join("")
    .toUpperCase();
}

function formatMemberDate(
  date,
  locale,
  unavailableText
) {
  if (!date) {
    return unavailableText;
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return unavailableText;
  }

  return new Intl.DateTimeFormat(
    locale,
    {
      month: "long",
      year: "numeric",
    }
  ).format(parsedDate);
}

function getApiErrorMessage(
  error,
  fallbackMessage
) {
  const validationErrors =
    error.response?.data?.errors;

  const firstValidationError =
    validationErrors &&
    Object.values(
      validationErrors
    )
      .flat()
      .find(Boolean);

  return (
    firstValidationError ||
    fallbackMessage
  );
}

function Profile() {
  const { t, i18n } =
    useTranslation();

  const navigate =
    useNavigate();

  const toastTimeoutRef =
    useRef(null);

  const {
    user,
    isAuthenticated,
    isAuthLoading,
    logout,
    updateProfile,
    updateLocalUser,
    deleteAccount,
  } = useAuth();

  const locale =
    i18n.resolvedLanguage?.startsWith(
      "en"
    )
      ? "en-GB"
      : "pt-PT";

  const [
    activeTab,
    setActiveTab,
  ] = useState("profile");

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    email: "",
  });

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    isSavingProfile,
    setIsSavingProfile,
  ] = useState(false);

  const [
    toast,
    setToast,
  ] = useState("");

  const [
    toastType,
    setToastType,
  ] = useState("success");

  const [
    favorites,
    setFavorites,
  ] = useState([]);

  const [
    isLoadingFavorites,
    setIsLoadingFavorites,
  ] = useState(true);

  const [
    isDownloading,
    setIsDownloading,
  ] = useState(false);

  const [
    nasaApiKey,
    setNasaApiKey,
  ] = useState("");

  const [
    nasaKeyError,
    setNasaKeyError,
  ] = useState("");

  const [
    isSavingNasaKey,
    setIsSavingNasaKey,
  ] = useState(false);

  const [
    isRemovingNasaKey,
    setIsRemovingNasaKey,
  ] = useState(false);

  const [
    deleteConfirm,
    setDeleteConfirm,
  ] = useState("");

  const [
    deletePassword,
    setDeletePassword,
  ] = useState("");

  const [
    deleteError,
    setDeleteError,
  ] = useState("");

  const [
    isDeletingAccount,
    setIsDeletingAccount,
  ] = useState(false);

  useEffect(() => {
    if (
      !isAuthenticated ||
      !user
    ) {
      return undefined;
    }

    let isMounted = true;

    const timeoutId =
      window.setTimeout(
        async () => {
          try {
            setIsLoadingFavorites(
              true
            );

            const result =
              await getFavorites();

            if (isMounted) {
              setFavorites(
                Array.isArray(
                  result
                )
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
              setIsLoadingFavorites(
                false
              );
            }
          }
        },
        0
      );

    return () => {
      isMounted = false;

      window.clearTimeout(
        timeoutId
      );
    };
  }, [
    isAuthenticated,
    user,
  ]);

  useEffect(() => {
    return () => {
      if (
        toastTimeoutRef.current
      ) {
        window.clearTimeout(
          toastTimeoutRef.current
        );
      }
    };
  }, []);

  const favoriteTypes =
    useMemo(() => {
      const types =
        new Set(
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

  const userInitials =
    useMemo(
      () =>
        getInitials(
          user?.name
        ),
      [user?.name]
    );

  const accountType =
    user?.role === "admin"
      ? t(
          "profile.accountTypes.admin"
        )
      : t(
          "profile.accountTypes.user"
        );

  const memberSince =
    formatMemberDate(
      user?.created_at,
      locale,
      t(
        "profile.dateUnavailable"
      )
    );

  const deleteConfirmationWord =
    t(
      "profile.delete.confirmationWord"
    );

  if (isAuthLoading) {
    return (
      <main className="profile-page">
        <Container>
          <div
            className="profile-loading"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="profile-loading__avatar" />

            <div>
              <p>
                {t(
                  "profile.loading"
                )}
              </p>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (
    !isAuthenticated ||
    !user
  ) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: "/profile",
        }}
      />
    );
  }

  function showToast(
    message,
    type = "success"
  ) {
    if (
      toastTimeoutRef.current
    ) {
      window.clearTimeout(
        toastTimeoutRef.current
      );
    }

    setToast(message);
    setToastType(type);

    toastTimeoutRef.current =
      window.setTimeout(
        () => {
          setToast("");
          toastTimeoutRef.current =
            null;
        },
        TOAST_TIMEOUT_MS
      );
  }

  function handleChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (
        currentFormData
      ) => ({
        ...currentFormData,
        [name]: value,
      })
    );

    if (formError) {
      setFormError("");
    }
  }

  function handleStartEditing() {
    setFormData({
      name:
        user.name || "",
      email:
        user.email || "",
    });

    setFormError("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setFormData({
      name:
        user.name || "",
      email:
        user.email || "",
    });

    setFormError("");
    setIsEditing(false);
  }

  async function handleSaveProfile(
    event
  ) {
    event.preventDefault();

    setFormError("");

    const name =
      formData.name.trim();

    const email =
      formData.email.trim();

    if (
      !name ||
      !email
    ) {
      setFormError(
        t(
          "profile.errors.nameEmailRequired"
        )
      );

      return;
    }

    try {
      setIsSavingProfile(
        true
      );

      const response =
        await updateProfile({
          name,
          email,
        });

      setFormData({
        name:
          response.user.name,
        email:
          response.user.email,
      });

      setIsEditing(false);

      showToast(
        t(
          "profile.toast.profileUpdated"
        )
      );
    } catch (error) {
      setFormError(
        getApiErrorMessage(
          error,
          t(
            "profile.errors.profileUpdate"
          )
        )
      );
    } finally {
      setIsSavingProfile(
        false
      );
    }
  }

  async function handleSaveNasaApiKey(
    event
  ) {
    event.preventDefault();

    const trimmedKey =
      nasaApiKey.trim();

    setNasaKeyError("");

    if (!trimmedKey) {
      setNasaKeyError(
        t(
          "profile.errors.nasaKeyRequired"
        )
      );

      return;
    }

    try {
      setIsSavingNasaKey(
        true
      );

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
        t(
          "profile.toast.nasaKeySaved"
        )
      );
    } catch (error) {
      setNasaKeyError(
        getApiErrorMessage(
          error,
          t(
            "profile.errors.nasaKeySave"
          )
        )
      );
    } finally {
      setIsSavingNasaKey(
        false
      );
    }
  }

  async function handleRemoveNasaApiKey() {
    const confirmed =
      window.confirm(
        t(
          "profile.nasaKey.removeConfirm"
        )
      );

    if (!confirmed) {
      return;
    }

    try {
      setIsRemovingNasaKey(
        true
      );

      setNasaKeyError("");

      const response =
        await removeNasaApiKey();

      updateLocalUser({
        has_nasa_api_key:
          response.has_nasa_api_key,
      });

      setNasaApiKey("");

      showToast(
        t(
          "profile.toast.nasaKeyRemoved"
        )
      );
    } catch (error) {
      setNasaKeyError(
        getApiErrorMessage(
          error,
          t(
            "profile.errors.nasaKeyRemove"
          )
        )
      );
    } finally {
      setIsRemovingNasaKey(
        false
      );
    }
  }

  async function handleDownloadData() {
    try {
      setIsDownloading(
        true
      );

      const updatedFavorites =
        await getFavorites();

      const exportData = {
        exportedAt:
          new Date().toISOString(),

        profile: {
          id: user.id,
          name: user.name,
          email: user.email,
          role:
            user.role ||
            "user",
          createdAt:
            user.created_at ||
            null,
          hasNasaApiKey:
            Boolean(
              user.has_nasa_api_key
            ),
        },

        favorites:
          Array.isArray(
            updatedFavorites
          )
            ? updatedFavorites
            : [],
      };

      const blob =
        new Blob(
          [
            JSON.stringify(
              exportData,
              null,
              2
            ),
          ],
          {
            type:
              "application/json",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;
      link.download =
        `spacevision-data-${user.id}.json`;

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      URL.revokeObjectURL(
        url
      );

      showToast(
        t(
          "profile.toast.downloadStarted"
        )
      );
    } catch (error) {
      console.error(
        "Erro ao descarregar dados:",
        error
      );

      showToast(
        t(
          "profile.errors.download"
        ),
        "error"
      );
    } finally {
      setIsDownloading(
        false
      );
    }
  }

  async function handleDeleteAccount(
    event
  ) {
    event.preventDefault();

    setDeleteError("");

    if (
      deleteConfirm
        .trim()
        .toLocaleUpperCase(
          locale
        ) !==
      deleteConfirmationWord
        .toLocaleUpperCase(
          locale
        )
    ) {
      setDeleteError(
        t(
          "profile.errors.deleteWord",
          {
            word:
              deleteConfirmationWord,
          }
        )
      );

      return;
    }

    if (
      !deletePassword.trim()
    ) {
      setDeleteError(
        t(
          "profile.errors.deletePasswordRequired"
        )
      );

      return;
    }

    const confirmed =
      window.confirm(
        t(
          "profile.delete.finalConfirm"
        )
      );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeletingAccount(
        true
      );

      await deleteAccount(
        deletePassword
      );

      navigate("/", {
        replace: true,
        state: {
          message: t(
            "profile.toast.accountDeleted"
          ),
        },
      });
    } catch (error) {
      setDeleteError(
        getApiErrorMessage(
          error,
          t(
            "profile.errors.accountDelete"
          )
        )
      );
    } finally {
      setIsDeletingAccount(
        false
      );
    }
  }

  async function handleLogout() {
    await logout();

    navigate("/");
  }

  async function handleTabClick(
    tab
  ) {
    if (
      tab.id === "logout"
    ) {
      await handleLogout();

      return;
    }

    setFormError("");
    setDeleteError("");
    setNasaKeyError("");

    if (
      tab.id !== "delete"
    ) {
      setDeleteConfirm("");
      setDeletePassword("");
    }

    if (
      tab.id !== "nasa-key"
    ) {
      setNasaApiKey("");
    }

    setActiveTab(tab.id);
  }

  return (
    <>
      <PageMeta
        title={t(
          "profile.meta.title"
        )}
        description={t(
          "profile.meta.description"
        )}
      />

      <main className="profile-page">
        <Container>
          <Breadcrumb
            title={t(
              "profile.breadcrumb"
            )}
          />

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
                  {t(
                    "profile.hero.label"
                  )}
                </p>

                <h1>
                  {user.name}
                </h1>

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
                {t(
                  "profile.hero.communityMember"
                )}
              </p>
            </div>
          </section>

          <section
            className="profile-stats"
            aria-label={t(
              "profile.stats.aria"
            )}
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
                  {t(
                    "profile.stats.savedFavorites"
                  )}
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
                  {t(
                    "profile.stats.exploredSources"
                  )}
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
                  {t(
                    "profile.stats.accountType"
                  )}
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
                  {t(
                    "profile.stats.memberSince"
                  )}
                </span>
              </div>
            </article>
          </section>

          {toast && (
            <Toast
              message={toast}
              type={toastType}
              onClose={() =>
                setToast("")
              }
            />
          )}

          <section className="profile-workspace">
            <nav
              className="profile-sidebar"
              aria-label={t(
                "profile.sidebar.aria"
              )}
            >
              <div className="profile-sidebar__heading">
                <span>
                  {t(
                    "profile.sidebar.heading"
                  )}
                </span>
              </div>

              {TABS.map(
                (tab) => {
                  const TabIcon =
                    tab.icon;

                  return (
                    <button
                      key={
                        tab.id
                      }
                      type="button"
                      className={[
                        "profile-sidebar__tab",

                        activeTab ===
                        tab.id
                          ? "profile-sidebar__tab--active"
                          : "",

                        tab.danger
                          ? "profile-sidebar__tab--danger"
                          : "",
                      ]
                        .filter(
                          Boolean
                        )
                        .join(" ")}
                      onClick={() =>
                        handleTabClick(
                          tab
                        )
                      }
                      aria-current={
                        activeTab ===
                        tab.id
                          ? "page"
                          : undefined
                      }
                    >
                      <TabIcon
                        size={18}
                        aria-hidden="true"
                      />

                      <span>
                        {t(
                          tab.labelKey
                        )}
                      </span>
                    </button>
                  );
                }
              )}
            </nav>

            <div className="profile-content">
              {activeTab ===
                "profile" && (
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
                          {t(
                            "profile.personal.label"
                          )}
                        </p>

                        <h2>
                          {t(
                            "profile.personal.title"
                          )}
                        </h2>

                        <p className="profile-card__intro">
                          {t(
                            "profile.personal.description"
                          )}
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

                        {t(
                          "profile.actions.edit"
                        )}
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
                        <label htmlFor="profile-name">
                          {t(
                            "profile.fields.name"
                          )}
                        </label>

                        <input
                          id="profile-name"
                          name="name"
                          type="text"
                          value={
                            isEditing
                              ? formData.name
                              : user.name ||
                                ""
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
                        <label htmlFor="profile-email">
                          {t(
                            "profile.fields.email"
                          )}
                        </label>

                        <input
                          id="profile-email"
                          name="email"
                          type="email"
                          value={
                            isEditing
                              ? formData.email
                              : user.email ||
                                ""
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
                        <label htmlFor="profile-role">
                          {t(
                            "profile.fields.accountType"
                          )}
                        </label>

                        <input
                          id="profile-role"
                          type="text"
                          value={
                            accountType
                          }
                          disabled
                        />
                      </div>

                      <div className="profile-form__field">
                        <label htmlFor="profile-member-since">
                          {t(
                            "profile.fields.memberSince"
                          )}
                        </label>

                        <input
                          id="profile-member-since"
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
                            ? t(
                                "profile.actions.saving"
                              )
                            : t(
                                "profile.actions.saveChanges"
                              )}
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
                          {t(
                            "profile.actions.cancel"
                          )}
                        </Button>
                      </div>
                    )}
                  </form>
                </article>
              )}

              {activeTab ===
                "nasa-key" && (
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
                        {t(
                          "profile.nasaKey.label"
                        )}
                      </p>

                      <h2>
                        {t(
                          "profile.nasaKey.title"
                        )}
                      </h2>

                      <p className="profile-card__intro">
                        {t(
                          "profile.nasaKey.descriptionBeforeLink"
                        )}{" "}
                        <a
                          href="https://api.nasa.gov/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="profile-card__link"
                        >
                          api.nasa.gov
                        </a>
                        .
                      </p>

                      <div
                        className={[
                          "profile-nasa-key-status",

                          user.has_nasa_api_key
                            ? "profile-nasa-key-status--active"
                            : "",
                        ]
                          .filter(
                            Boolean
                          )
                          .join(" ")}
                        role="status"
                      >
                        <ShieldCheck
                          size={18}
                          aria-hidden="true"
                        />

                        <span>
                          {user.has_nasa_api_key
                            ? t(
                                "profile.nasaKey.statusConfigured"
                              )
                            : t(
                                "profile.nasaKey.statusShared"
                              )}
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
                            {t(
                              "profile.nasaKey.fieldLabel"
                            )}
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
                                event
                                  .target
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
                                ? t(
                                    "profile.nasaKey.replacePlaceholder"
                                  )
                                : t(
                                    "profile.nasaKey.addPlaceholder"
                                  )
                            }
                            autoComplete="off"
                            spellCheck="false"
                            disabled={
                              isSavingNasaKey ||
                              isRemovingNasaKey
                            }
                          />

                          <p className="profile-form__help">
                            {t(
                              "profile.nasaKey.help"
                            )}
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
                              ? t(
                                  "profile.nasaKey.validating"
                                )
                              : user.has_nasa_api_key
                                ? t(
                                    "profile.nasaKey.replace"
                                  )
                                : t(
                                    "profile.nasaKey.save"
                                  )}
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
                                ? t(
                                    "profile.nasaKey.removing"
                                  )
                                : t(
                                    "profile.nasaKey.remove"
                                  )}
                            </Button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </article>
              )}

              {activeTab ===
                "download" && (
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
                        {t(
                          "profile.download.label"
                        )}
                      </p>

                      <h2>
                        {t(
                          "profile.download.title"
                        )}
                      </h2>

                      <p className="profile-card__intro">
                        {t(
                          "profile.download.description"
                        )}
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
                          ? t(
                              "profile.download.preparing"
                            )
                          : t(
                              "profile.download.action"
                            )}
                      </Button>
                    </div>
                  </div>
                </article>
              )}

              {activeTab ===
                "delete" && (
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
                        {t(
                          "profile.delete.label"
                        )}
                      </p>

                      <h2>
                        {t(
                          "profile.delete.title"
                        )}
                      </h2>

                      <p className="profile-card__intro">
                        {t(
                          "profile.delete.description"
                        )}
                      </p>

                      <form
                        className="profile-form"
                        onSubmit={
                          handleDeleteAccount
                        }
                      >
                        <div className="profile-form__field">
                          <label htmlFor="deleteConfirm">
                            {t(
                              "profile.delete.confirmLabelBefore"
                            )}{" "}
                            <strong>
                              {
                                deleteConfirmationWord
                              }
                            </strong>{" "}
                            {t(
                              "profile.delete.confirmLabelAfter"
                            )}
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
                            ) => {
                              setDeleteConfirm(
                                event
                                  .target
                                  .value
                              );

                              if (
                                deleteError
                              ) {
                                setDeleteError(
                                  ""
                                );
                              }
                            }}
                            placeholder={
                              deleteConfirmationWord
                            }
                            autoComplete="off"
                            disabled={
                              isDeletingAccount
                            }
                          />
                        </div>

                        <div className="profile-form__field">
                          <label htmlFor="deletePassword">
                            {t(
                              "profile.delete.passwordLabel"
                            )}
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
                            ) => {
                              setDeletePassword(
                                event
                                  .target
                                  .value
                              );

                              if (
                                deleteError
                              ) {
                                setDeleteError(
                                  ""
                                );
                              }
                            }}
                            placeholder={t(
                              "profile.delete.passwordPlaceholder"
                            )}
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
                            ? t(
                                "profile.delete.deleting"
                              )
                            : t(
                                "profile.delete.action"
                              )}
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