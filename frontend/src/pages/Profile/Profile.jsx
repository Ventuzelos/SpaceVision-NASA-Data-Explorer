import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import Container from "../../components/common/Container/Container";
import Button from "../../components/common/Button/Button";
import Toast from "../../components/common/Toast/Toast";
import {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  logoutUser,
} from "../../services/authService";
import { getFavorites } from "../../services/favoritesService";
import { getContactMessagesByEmail } from "../../services/messagesService";

import "./Profile.css";

const TABS = [
  { id: "profile", label: "O meu perfil" },
  { id: "download", label: "Descarregar os meus dados" },
  { id: "delete", label: "Eliminar conta", danger: true },
  { id: "logout", label: "Terminar sessão" },
];

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Página só acessível a utilizadores autenticados.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSaveProfile(event) {
    event.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Preenche o nome e o email.");
      return;
    }

    try {
      const updatedUser = updateCurrentUser(formData);
      setUser(updatedUser);
      setIsEditing(false);
      showToast("Dados atualizados com sucesso.");
    } catch (err) {
      setFormError(err.message);
    }
  }

  function handleCancelEdit() {
    setFormData({ name: user.name, email: user.email });
    setFormError("");
    setIsEditing(false);
  }

  function handleDownloadData() {
    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      favorites: getFavorites(),
      contactMessages: getContactMessagesByEmail(user.email),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `spacevision-dados-${user.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("Download iniciado.");
  }

  function handleDeleteAccount(event) {
    event.preventDefault();
    setDeleteError("");

    if (deleteConfirm.trim().toUpperCase() !== "ELIMINAR") {
      setDeleteError('Escreve "ELIMINAR" para confirmares.');
      return;
    }

    deleteCurrentUser();
    navigate("/");
  }

  function handleLogout() {
    logoutUser();
    navigate("/");
  }

  function handleTabClick(tab) {
    if (tab.id === "logout") {
      handleLogout();
      return;
    }
    setActiveTab(tab.id);
  }

  return (
    <section className="profile-page">
      <Container>
        <header className="profile-page__header">
          <p className="profile-page__label">Área pessoal</p>
          <h1>O meu perfil</h1>
        </header>

        {toast && <Toast message={toast} type="success" />}

        <div className="profile-layout">
          <nav className="profile-sidebar" aria-label="Secções do perfil">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={[
                  "profile-sidebar__tab",
                  activeTab === tab.id ? "profile-sidebar__tab--active" : "",
                  tab.danger ? "profile-sidebar__tab--danger" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleTabClick(tab)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="profile-content">
            {activeTab === "profile" && (
              <div className="profile-card">
                <h2>Dados do utilizador</h2>
                <p className="profile-card__intro">
                  Consulta e atualiza a informação da tua conta.
                </p>

                <form className="profile-form" onSubmit={handleSaveProfile}>
                  <div className="profile-form__field">
                    <label htmlFor="name">Nome</label>
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
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  {formError && <p className="profile-error">{formError}</p>}

                  <div className="profile-form__actions">
                    {!isEditing ? (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => setIsEditing(true)}
                      >
                        Editar dados
                      </Button>
                    ) : (
                      <>
                        <Button type="submit" variant="primary">
                          Guardar alterações
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleCancelEdit}
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
                <h2>Descarregar os meus dados</h2>
                <p className="profile-card__intro">
                  Ao abrigo do direito à portabilidade dos dados, podes
                  descarregar uma cópia de tudo o que temos guardado sobre a
                  tua conta: dados do perfil, favoritos e mensagens que
                  enviaste através da página "Sobre nós".
                </p>

                <Button variant="primary" onClick={handleDownloadData}>
                  Descarregar dados (JSON)
                </Button>
              </div>
            )}

            {activeTab === "delete" && (
              <div className="profile-card profile-card--danger">
                <h2>Eliminar conta e dados</h2>
                <p className="profile-card__intro">
                  Ao abrigo do direito ao esquecimento, podes eliminar
                  definitivamente a tua conta. Esta ação remove os teus dados
                  de perfil e não pode ser desfeita.
                </p>

                <form className="profile-form" onSubmit={handleDeleteAccount}>
                  <div className="profile-form__field">
                    <label htmlFor="deleteConfirm">
                      Escreve <strong>ELIMINAR</strong> para confirmar
                    </label>
                    <input
                      id="deleteConfirm"
                      name="deleteConfirm"
                      type="text"
                      value={deleteConfirm}
                      onChange={(event) =>
                        setDeleteConfirm(event.target.value)
                      }
                      placeholder="ELIMINAR"
                    />
                  </div>

                  {deleteError && (
                    <p className="profile-error">{deleteError}</p>
                  )}

                  <Button type="submit" variant="secondary">
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