// Import React hooks for state and side effects
// React-Hooks für State und Seiteneffekte importieren
import { useState, useEffect } from "react";

// Import CSS styles for this component
// CSS-Styles für diese Komponente importieren
import "./App.css";

// TypeScript interface - defines the shape of a Quote object
// TypeScript-Interface - definiert die Struktur eines Quote-Objekts
interface Quote {
  id: number;           // Unique identifier / Eindeutiger Identifikator
  text: string;         // Quote text / Zitat-Text
  author: string;       // Author name / Autorenname
  createdAt: string;    // Creation timestamp / Erstellungszeitstempel
}

// TypeScript interface - defines the shape of a User object
// TypeScript-Interface - definiert die Struktur eines User-Objekts
interface User {
  id: number;           // Unique identifier / Eindeutiger Identifikator
  email: string;        // User email / Benutzer-E-Mail
  password?: string;    // Password (optional, not returned from API) / Passwort (optional, nicht von API zurückgegeben)
  createdAt: string;    // Creation timestamp / Erstellungszeitstempel
}

// Main App component - displays and manages quotes and users
// Haupt-App-Komponente - zeigt Zitate und Benutzer an und verwaltet sie
function App() {
  // Active tab state: 'quotes' or 'users'
  // Aktiver Tab-Status: 'quotes' oder 'users'
  const [activeTab, setActiveTab] = useState<"quotes" | "users">("quotes");

  // ========== QUOTES STATE ==========
  // State: Array of all quotes fetched from API
  // State: Array aller von der API abgerufenen Zitate
  const [quotes, setQuotes] = useState<Quote[]>([]);

  // State: Loading indicator for quotes
  // State: Lade-Indikator für Zitate
  const [quotesLoading, setQuotesLoading] = useState(true);

  // State: Error message for quotes
  // State: Fehlermeldung für Zitate
  const [quotesError, setQuotesError] = useState<string | null>(null);

  // State: Form data for creating/editing quote
  // State: Formulardaten zum Erstellen/Bearbeiten eines Zitats
  const [quoteForm, setQuoteForm] = useState({ text: "", author: "" });

  // State: ID of quote being edited (null if creating new)
  // State: ID des zu bearbeitenden Zitats (null beim Erstellen eines neuen)
  const [editingQuoteId, setEditingQuoteId] = useState<number | null>(null);

  // State: Filter parameters for quotes
  // State: Filterparameter für Zitate
  const [quoteFilters, setQuoteFilters] = useState({ author: "", limit: "" });

  // ========== USERS STATE ==========
  // State: Array of all users fetched from API
  // State: Array aller von der API abgerufenen Benutzer
  const [users, setUsers] = useState<User[]>([]);

  // State: Loading indicator for users
  // State: Lade-Indikator für Benutzer
  const [usersLoading, setUsersLoading] = useState(true);

  // State: Error message for users
  // State: Fehlermeldung für Benutzer
  const [usersError, setUsersError] = useState<string | null>(null);

  // State: Form data for creating/editing user
  // State: Formulardaten zum Erstellen/Bearbeiten eines Benutzers
  const [userForm, setUserForm] = useState({ email: "", password: "" });

  // State: ID of user being edited (null if creating new)
  // State: ID des zu bearbeitenden Benutzers (null beim Erstellen eines neuen)
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  // State: Filter parameter for users
  // State: Filterparameter für Benutzer
  const [userLimit, setUserLimit] = useState("");

  // useEffect hook - runs when component mounts or tab changes
  // useEffect-Hook - läuft, wenn Komponente gemountet wird oder Tab wechselt
  useEffect(() => {
    if (activeTab === "quotes") {
      fetchQuotes(); // Fetch quotes when quotes tab is active / Zitate abrufen, wenn Zitate-Tab aktiv ist
    } else {
      fetchUsers(); // Fetch users when users tab is active / Benutzer abrufen, wenn Benutzer-Tab aktiv ist
    }
  }, [activeTab]);

  // ========== QUOTES FUNCTIONS ==========

  // fetchQuotes - fetches all quotes from the backend API with filters
  // fetchQuotes - ruft alle Zitate von der Backend-API mit Filtern ab
  const fetchQuotes = async () => {
    try {
      setQuotesLoading(true); // Show loading indicator / Lade-Indikator anzeigen

      // Build query string with filters
      // Query-String mit Filtern erstellen
      const params = new URLSearchParams();
      if (quoteFilters.author) params.append("author", quoteFilters.author);
      if (quoteFilters.limit) params.append("limit", quoteFilters.limit);
      const queryString = params.toString() ? `?${params.toString()}` : "";

      // GET request to /quotes endpoint with filters
      // GET-Anfrage an /quotes-Endpunkt mit Filtern
      const response = await fetch(`/quotes${queryString}`);

      // Check if request was successful (status 200-299)
      // Prüfen, ob Anfrage erfolgreich war (Status 200-299)
      if (!response.ok) throw new Error("Failed to fetch quotes");

      // Parse JSON response body
      // JSON-Antwort-Body parsen
      const data = await response.json();

      // Update state with fetched quotes
      // State mit abgerufenen Zitaten aktualisieren
      setQuotes(data);
      setQuotesError(null); // Clear any previous errors / Vorherige Fehler löschen
    } catch (err) {
      // Handle errors and display message to user
      // Fehler behandeln und Nachricht dem Benutzer anzeigen
      setQuotesError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      // Always stop loading indicator, even if error occurred
      // Lade-Indikator immer stoppen, auch bei Fehler
      setQuotesLoading(false);
    }
  };

  // handleQuoteSubmit - creates or updates a quote via POST/PUT request
  // handleQuoteSubmit - erstellt oder aktualisiert ein Zitat per POST/PUT-Anfrage
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission (page reload)
    // Standard-Formularübermittlung verhindern (Seiten-Neuladen)
    e.preventDefault();

    // Validate: both fields must be filled
    // Validierung: beide Felder müssen ausgefüllt sein
    if (!quoteForm.text || !quoteForm.author) return;

    try {
      let response;

      if (editingQuoteId) {
        // UPDATE existing quote with PUT
        // Vorhandenes Zitat mit PUT aktualisieren
        response = await fetch(`/quotes/${editingQuoteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quoteForm),
        });
      } else {
        // CREATE new quote with POST
        // Neues Zitat mit POST erstellen
        response = await fetch("/quotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quoteForm),
        });
      }

      // Check if operation was successful
      // Prüfen, ob Operation erfolgreich war
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save quote");
      }

      // Reset form fields and editing state
      // Formularfelder und Bearbeitungsstatus zurücksetzen
      setQuoteForm({ text: "", author: "" });
      setEditingQuoteId(null);

      // Refresh the quotes list
      // Zitatsliste aktualisieren
      fetchQuotes();
    } catch (err) {
      // Handle errors
      // Fehler behandeln
      setQuotesError(err instanceof Error ? err.message : "Failed to save quote");
    }
  };

  // handleEditQuote - prepares form for editing an existing quote
  // handleEditQuote - bereitet Formular zum Bearbeiten eines vorhandenen Zitats vor
  const handleEditQuote = (quote: Quote) => {
    setQuoteForm({ text: quote.text, author: quote.author });
    setEditingQuoteId(quote.id);
    // Scroll to form / Zum Formular scrollen
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // handleCancelEditQuote - cancels editing and resets form
  // handleCancelEditQuote - bricht Bearbeitung ab und setzt Formular zurück
  const handleCancelEditQuote = () => {
    setQuoteForm({ text: "", author: "" });
    setEditingQuoteId(null);
  };

  // handleDeleteQuote - deletes a quote by ID via DELETE request
  // handleDeleteQuote - löscht ein Zitat per ID über DELETE-Anfrage
  const handleDeleteQuote = async (id: number) => {
    // Confirm deletion with user
    // Löschung mit Benutzer bestätigen
    if (!confirm("Are you sure you want to delete this quote?")) return;

    try {
      // DELETE request to /quotes/:id endpoint
      // DELETE-Anfrage an /quotes/:id-Endpunkt
      const response = await fetch(`/quotes/${id}`, { method: "DELETE" });

      // Check if deletion was successful
      // Prüfen, ob Löschung erfolgreich war
      if (!response.ok) throw new Error("Failed to delete quote");

      // Refresh the quotes list to show updated data
      // Zitatsliste aktualisieren, um aktualisierte Daten anzuzeigen
      fetchQuotes();
    } catch (err) {
      // Handle errors
      // Fehler behandeln
      setQuotesError(err instanceof Error ? err.message : "Failed to delete quote");
    }
  };

  // ========== USERS FUNCTIONS ==========

  // fetchUsers - fetches all users from the backend API
  // fetchUsers - ruft alle Benutzer von der Backend-API ab
  const fetchUsers = async () => {
    try {
      setUsersLoading(true); // Show loading indicator / Lade-Indikator anzeigen

      // Build query string with limit filter
      // Query-String mit Limit-Filter erstellen
      const queryString = userLimit ? `?limit=${userLimit}` : "";

      // GET request to /users endpoint
      // GET-Anfrage an /users-Endpunkt
      const response = await fetch(`/users${queryString}`);

      // Check if request was successful
      // Prüfen, ob Anfrage erfolgreich war
      if (!response.ok) throw new Error("Failed to fetch users");

      // Parse JSON response body
      // JSON-Antwort-Body parsen
      const data = await response.json();

      // Update state with fetched users
      // State mit abgerufenen Benutzern aktualisieren
      setUsers(data);
      setUsersError(null); // Clear any previous errors / Vorherige Fehler löschen
    } catch (err) {
      // Handle errors and display message to user
      // Fehler behandeln und Nachricht dem Benutzer anzeigen
      setUsersError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      // Always stop loading indicator
      // Lade-Indikator immer stoppen
      setUsersLoading(false);
    }
  };

  // handleUserSubmit - creates or updates a user via POST/PUT request
  // handleUserSubmit - erstellt oder aktualisiert einen Benutzer per POST/PUT-Anfrage
  const handleUserSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission
    // Standard-Formularübermittlung verhindern
    e.preventDefault();

    // Validate: email is always required, password required for new users
    // Validierung: E-Mail ist immer erforderlich, Passwort für neue Benutzer erforderlich
    if (!userForm.email || (!editingUserId && !userForm.password)) return;

    try {
      let response;

      if (editingUserId) {
        // UPDATE existing user with PUT (only send fields that are filled)
        // Vorhandenen Benutzer mit PUT aktualisieren (nur ausgefüllte Felder senden)
        const updateData: any = { email: userForm.email };
        if (userForm.password) updateData.password = userForm.password;

        response = await fetch(`/users/${editingUserId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
      } else {
        // CREATE new user with POST
        // Neuen Benutzer mit POST erstellen
        response = await fetch("/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userForm),
        });
      }

      // Check if operation was successful
      // Prüfen, ob Operation erfolgreich war
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save user");
      }

      // Reset form fields and editing state
      // Formularfelder und Bearbeitungsstatus zurücksetzen
      setUserForm({ email: "", password: "" });
      setEditingUserId(null);

      // Refresh the users list
      // Benutzerliste aktualisieren
      fetchUsers();
    } catch (err) {
      // Handle errors
      // Fehler behandeln
      setUsersError(err instanceof Error ? err.message : "Failed to save user");
    }
  };

  // handleEditUser - prepares form for editing an existing user
  // handleEditUser - bereitet Formular zum Bearbeiten eines vorhandenen Benutzers vor
  const handleEditUser = (user: User) => {
    setUserForm({ email: user.email, password: "" }); // Don't pre-fill password / Passwort nicht vorab ausfüllen
    setEditingUserId(user.id);
    // Scroll to form / Zum Formular scrollen
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // handleCancelEditUser - cancels editing and resets form
  // handleCancelEditUser - bricht Bearbeitung ab und setzt Formular zurück
  const handleCancelEditUser = () => {
    setUserForm({ email: "", password: "" });
    setEditingUserId(null);
  };

  // handleDeleteUser - deletes a user by ID via DELETE request
  // handleDeleteUser - löscht einen Benutzer per ID über DELETE-Anfrage
  const handleDeleteUser = async (id: number) => {
    // Confirm deletion with user
    // Löschung mit Benutzer bestätigen
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      // DELETE request to /users/:id endpoint
      // DELETE-Anfrage an /users/:id-Endpunkt
      const response = await fetch(`/users/${id}`, { method: "DELETE" });

      // Check if deletion was successful
      // Prüfen, ob Löschung erfolgreich war
      if (!response.ok) throw new Error("Failed to delete user");

      // Refresh the users list
      // Benutzerliste aktualisieren
      fetchUsers();
    } catch (err) {
      // Handle errors
      // Fehler behandeln
      setUsersError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  // ========== RENDER ==========

  // Main render: display the fullstack app UI with tabs
  // Haupt-Render: Fullstack-App-UI mit Tabs anzeigen
  return (
    <div className="container">
      {/* Main heading / Hauptüberschrift */}
      <h1>Fullstack App - Quotes & Users</h1>

      {/* Tab navigation / Tab-Navigation */}
      <div className="tabs">
        <button
          className={activeTab === "quotes" ? "tab active" : "tab"}
          onClick={() => setActiveTab("quotes")}
        >
          Quotes
        </button>
        <button
          className={activeTab === "users" ? "tab active" : "tab"}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
      </div>

      {/* QUOTES TAB / ZITATE-TAB */}
      {activeTab === "quotes" && (
        <div className="tab-content">
          {/* Error message / Fehlermeldung */}
          {quotesError && <div className="error">{quotesError}</div>}

          {/* Filters section / Filter-Bereich */}
          <div className="filters">
            <h3>Filters / Filter</h3>
            <div className="filter-row">
              <input
                type="text"
                placeholder="Filter by author / Nach Autor filtern"
                value={quoteFilters.author}
                onChange={(e) =>
                  setQuoteFilters({ ...quoteFilters, author: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Limit / Begrenzung"
                value={quoteFilters.limit}
                onChange={(e) =>
                  setQuoteFilters({ ...quoteFilters, limit: e.target.value })
                }
              />
              <button onClick={() => fetchQuotes()}>Apply / Anwenden</button>
              <button
                onClick={() => {
                  setQuoteFilters({ author: "", limit: "" });
                  setTimeout(fetchQuotes, 0);
                }}
              >
                Clear / Löschen
              </button>
            </div>
          </div>

          {/* Form to create/edit quote / Formular zum Erstellen/Bearbeiten eines Zitats */}
          <form onSubmit={handleQuoteSubmit} className="quote-form">
            <h2>
              {editingQuoteId
                ? "Edit Quote / Zitat bearbeiten"
                : "Add New Quote / Neues Zitat hinzufügen"}
            </h2>

            {/* Input for quote text / Eingabe für Zitat-Text */}
            <textarea
              placeholder="Quote text / Zitat-Text"
              value={quoteForm.text}
              onChange={(e) =>
                setQuoteForm({ ...quoteForm, text: e.target.value })
              }
              required
              rows={3}
            />

            {/* Input for author name / Eingabe für Autorenname */}
            <input
              type="text"
              placeholder="Author / Autor"
              value={quoteForm.author}
              onChange={(e) =>
                setQuoteForm({ ...quoteForm, author: e.target.value })
              }
              required
            />

            {/* Buttons / Schaltflächen */}
            <div className="form-buttons">
              <button type="submit">
                {editingQuoteId ? "Update / Aktualisieren" : "Add / Hinzufügen"}
              </button>
              {editingQuoteId && (
                <button type="button" onClick={handleCancelEditQuote}>
                  Cancel / Abbrechen
                </button>
              )}
            </div>
          </form>

          {/* Loading indicator / Lade-Indikator */}
          {quotesLoading && <div className="loading">Loading quotes...</div>}

          {/* List of all quotes / Liste aller Zitate */}
          {!quotesLoading && (
            <div className="quotes-list">
              <h2>All Quotes ({quotes.length})</h2>

              {quotes.length === 0 && (
                <p className="no-data">No quotes found / Keine Zitate gefunden</p>
              )}

              {/* Map over quotes array to render each quote card */}
              {/* Über Zitate-Array iterieren, um jede Zitat-Karte zu rendern */}
              {quotes.map((quote) => (
                <div key={quote.id} className="quote-card">
                  {/* Quote text with quotation marks / Zitat-Text mit Anführungszeichen */}
                  <p className="quote-text">"{quote.text}"</p>

                  {/* Author name with em dash / Autorenname mit Gedankenstrich */}
                  <p className="quote-author">— {quote.author}</p>

                  {/* Action buttons / Aktions-Schaltflächen */}
                  <div className="card-actions">
                    <button
                      onClick={() => handleEditQuote(quote)}
                      className="edit-btn"
                    >
                      Edit / Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDeleteQuote(quote.id)}
                      className="delete-btn"
                    >
                      Delete / Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* USERS TAB / BENUTZER-TAB */}
      {activeTab === "users" && (
        <div className="tab-content">
          {/* Error message / Fehlermeldung */}
          {usersError && <div className="error">{usersError}</div>}

          {/* Filters section / Filter-Bereich */}
          <div className="filters">
            <h3>Filters / Filter</h3>
            <div className="filter-row">
              <input
                type="number"
                placeholder="Limit / Begrenzung"
                value={userLimit}
                onChange={(e) => setUserLimit(e.target.value)}
              />
              <button onClick={() => fetchUsers()}>Apply / Anwenden</button>
              <button
                onClick={() => {
                  setUserLimit("");
                  setTimeout(fetchUsers, 0);
                }}
              >
                Clear / Löschen
              </button>
            </div>
          </div>

          {/* Form to create/edit user / Formular zum Erstellen/Bearbeiten eines Benutzers */}
          <form onSubmit={handleUserSubmit} className="user-form">
            <h2>
              {editingUserId
                ? "Edit User / Benutzer bearbeiten"
                : "Add New User / Neuen Benutzer hinzufügen"}
            </h2>

            {/* Input for email / Eingabe für E-Mail */}
            <input
              type="email"
              placeholder="Email"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              required
            />

            {/* Input for password / Eingabe für Passwort */}
            <input
              type="password"
              placeholder={
                editingUserId
                  ? "Password (leave empty to keep current) / Passwort (leer lassen, um aktuelles beizubehalten)"
                  : "Password (min 6 characters) / Passwort (mind. 6 Zeichen)"
              }
              value={userForm.password}
              onChange={(e) =>
                setUserForm({ ...userForm, password: e.target.value })
              }
              required={!editingUserId}
              minLength={6}
            />

            {/* Buttons / Schaltflächen */}
            <div className="form-buttons">
              <button type="submit">
                {editingUserId ? "Update / Aktualisieren" : "Add / Hinzufügen"}
              </button>
              {editingUserId && (
                <button type="button" onClick={handleCancelEditUser}>
                  Cancel / Abbrechen
                </button>
              )}
            </div>
          </form>

          {/* Loading indicator / Lade-Indikator */}
          {usersLoading && <div className="loading">Loading users...</div>}

          {/* List of all users / Liste aller Benutzer */}
          {!usersLoading && (
            <div className="users-list">
              <h2>All Users ({users.length})</h2>

              {users.length === 0 && (
                <p className="no-data">No users found / Keine Benutzer gefunden</p>
              )}

              {/* Map over users array to render each user card */}
              {/* Über Benutzer-Array iterieren, um jede Benutzer-Karte zu rendern */}
              {users.map((user) => (
                <div key={user.id} className="user-card">
                  {/* User info / Benutzerinformationen */}
                  <div className="user-info">
                    <p className="user-email">
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p className="user-id">
                      <strong>ID:</strong> {user.id}
                    </p>
                    <p className="user-created">
                      <strong>Created:</strong>{" "}
                      {new Date(user.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Action buttons / Aktions-Schaltflächen */}
                  <div className="card-actions">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="edit-btn"
                    >
                      Edit / Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="delete-btn"
                    >
                      Delete / Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Export App component as default export
// App-Komponente als Standard-Export exportieren
export default App;
