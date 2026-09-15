import React, { useState, useMemo } from "react";

// ---------------------------------------------------------------------------
// Sample data — stands in for the students / routes / buses / bus_passes
// tables, plus a lightweight alumni table. In a real build, login would call
// a backend (JWT) instead of matching against this array in the browser.
// ---------------------------------------------------------------------------
const STUDENTS = [
  {
    studentId: "24JECS212",
    password: "24JPR@212",
    parentCode: "4041",
    name: "Ariana Fonseca",
    department: "Computer Science",
    year: "3rd Year",
    initials: "AF",
    pass: { passId: "BP-10412", status: "Active", validFrom: "01 Jun 2026", validUntil: "31 May 2027" },
    bus: { number: "TN-07-BX-4471", label: "12" },
    route: {
      number: "R-12",
      name: "Anna Nagar – College Loop",
      start: "Anna Nagar West",
      destination: "JPR College Campus",
      pickupStop: "Kilpauk signal",
      dropStop: "JPR College Campus",
      stops: ["Anna Nagar West","Anna Nagar East", "Kilpauk Signal", "Chetpet Police Station", "Alwarpet", "JPR College Campus"],
      departure: "6:15 AM",
      arrival: "7:30 AM",
    },
  },
  {
    studentId: "25JEME164",
    password: "25JPR@164",
    parentCode: "4078",
    name: "Karthik Subramaniam",
    department: "Mechanical Engg.",
    year: "2nd Year",
    initials: "KS",
    pass: { passId: "BP-10455", status: "Pending", validFrom: "—", validUntil: "—" },
    bus: { number: "Unassigned", label: "—" },
    route: {
      number: "R-05",
      name: "Pallavaram – College Express",
      start: "Pallavaram",
      destination: "JPR College Campus",
      pickupStop: "Chromepet",
      dropStop: "JPR College Campus",
      stops: ["Pallavaram", "Chromepet","Sanatorium Bridge", "Tambaram", "JPR College Campus"],
      departure: "6:25 AM",
      arrival: "7:30 AM",
    },
  },
  {
    studentId: "23JEEC196",
    password: "23JPR@196",
    parentCode: "4996",
    name: "Meera Pillai",
    department: "Electronics & Comm.",
    year: "4th Year",
    initials: "MP",
    pass: { passId: "BP-09980", status: "Expired", validFrom: "01 Jun 2025", validUntil: "31 May 2026" },
    bus: { number: "TN-09-CY-2210", label: "3" },
    route: {
      number: "R-03",
      name: "Saidpet – College Route",
      start: "Saidpet",
      destination: "JPR College Campus",
      pickupStop: "Guindy",
      dropStop: "JPR College Campus",
      stops: ["Saidpet", "Guindy", "Velachery", "JPR College Campus"],
      departure: "6:30 AM",
      arrival: "7:30 AM",
    },
  },
  {
    studentId: "26JECE109",
    password: "26JPR@109",
    parentCode: "4109",
    name: "Rohit Bansal",
    department: "Civil Engineering",
    year: "1st Year",
    initials: "RB",
    pass: { passId: "BP-10501", status: "Rejected", validFrom: "—", validUntil: "—" },
    bus: { number: "Unassigned", label: "—" },
    route: {
      number: "R-08",
      name: "Ramapuram – College Shuttle",
      start: "Ramapuram",
      destination: "JPR College Campus",
      pickupStop: "Mugalivakkam",
      dropStop: "JPR College Campus",
      stops: ["Ramapuram", "Mugalivakkam", "Porur", "JPR College Campus"],
      departure: "6:20 AM",
      arrival: "7:30 AM",
    },
  },
];

const ALUMNI = [
  {
    alumniId: "22JEME090",
    password: "22JPR@090",
    name: "Suresh Kumar",
    department: "Mechanical Engg.",
    graduationYear: "2022",
    initials: "SK",
    serviceEnded: "31 May 2023",
    lastRoute: { number: "R-03", name: "Velachery – College Route", pickupStop: "Guindy" },
    lastBus: { number: "TN-09-CY-2210", label: "3" },
  },
  {
    alumniId: "21@JEIT144",
    password: "21JPR@144",
    name: "Priya Ramesh",
    department: "Information Tech.",
    graduationYear: "2021",
    initials: "PR",
    serviceEnded: "31 May 2024",
    lastRoute: { number: "R-12", name: "Anna Nagar – College Loop", pickupStop: "Vadapalani" },
    lastBus: { number: "TN-07-BX-4471", label: "12" },
  },
];

const STATUS_STYLE = {
  Active: { bg: "#E4F1EC", fg: "#1F7A6C", dot: "#1F7A6C" },
  Pending: { bg: "#FBF0DA", fg: "#9A6A0C", dot: "#E3A008" },
  Expired: { bg: "#F1E9E7", fg: "#8A4A42", dot: "#8A4A42" },
  Rejected: { bg: "#F6E4E2", fg: "#B3392F", dot: "#C1443C" },
  Alumni: { bg: "#ECEDEE", fg: "#5A5F66", dot: "#5A5F66" },
};

const BUS_HUES = { "12": "#1F7A6C", "3": "#8A4A42", "5": "#2C5F8A", "—": "#8B8F94" };

const ROLES = [
  { id: "student", label: "Student" },
  { id: "parent", label: "Parent" },
  { id: "alumni", label: "Alumni" },
];

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------
function StatusPill({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Pending;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, background: s.bg, color: s.fg,
        padding: "5px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600,
        fontFamily: "'IBM Plex Sans', sans-serif", letterSpacing: "0.01em",
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />
      {status}
    </span>
  );
}

function BusBadge({ label }) {
  const hue = BUS_HUES[label] || "#8B8F94";
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34,
        borderRadius: "50%", background: hue, color: "#fff", fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700, fontSize: 15, flexShrink: 0,
      }}
    >
      {label}
    </span>
  );
}

function RouteStripe({ route }) {
  const total = route.stops.length;
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#6B7078", marginBottom: 8 }}>
        <span>{route.start}</span>
        <span>{route.destination}</span>
      </div>
      <div style={{ position: "relative", height: 20 }}>
        <div style={{ position: "absolute", top: 9, left: 0, right: 0, height: 2, background: "#D8DCD9" }} />
        {route.stops.map((stop, i) => {
          const left = (i / (total - 1)) * 100;
          const isPickup = stop === route.pickupStop;
          return (
            <div key={stop} title={stop} style={{ position: "absolute", top: 0, left: `${left}%`, transform: "translateX(-50%)" }}>
              <div
                style={{
                  width: isPickup ? 14 : 9, height: isPickup ? 14 : 9, borderRadius: "50%",
                  background: isPickup ? "#1F7A6C" : "#fff",
                  border: `2px solid ${isPickup ? "#1F7A6C" : "#B7BCB8"}`,
                  marginTop: isPickup ? 2 : 4,
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, marginTop: 6 }}>
        <span style={{ color: "#1F7A6C", fontWeight: 600 }}>Pickup · {route.pickupStop}</span>
        <span style={{ color: "#2C5F8A", fontWeight: 600 }}>Drop · {route.dropStop}</span>
      </div>
    </div>
  );
}

function PassCard({ student, viewerLabel }) {
  const s = student;
  const st = STATUS_STYLE[s.pass.status] || STATUS_STYLE.Pending;

  return (
    <div key={s.studentId} className="pass-card-enter" style={{ background: "#FFFFFF", border: "1px solid #E1E4E1", borderRadius: 4, overflow: "hidden", boxShadow: "0 1px 0 rgba(20,33,61,0.04)" }}>
      <div style={{ background: "#14213D", color: "#fff", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, letterSpacing: "0.04em", opacity: 0.75 }}>
            {viewerLabel || "Transport Pass"}
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700 }}>{s.pass.passId}</div>
        </div>
        <StatusPill status={s.pass.status} />
      </div>

      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EFF2F0", color: "#14213D", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
            {s.initials}
          </div>
          <div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 17, color: "#1B1F23" }}>{s.name}</div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#6B7078", marginTop: 2 }}>
              {s.studentId} · {s.department} · {s.year}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, marginTop: 22, paddingTop: 18, borderTop: "1px dashed #D8DCD9" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <BusBadge label={s.bus.label} />
            <div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#8B8F94" }}>Bus number</div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#1B1F23" }}>{s.bus.number}</div>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#8B8F94" }}>Route</div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#1B1F23" }}>{s.route.number} · {s.route.name}</div>
          </div>
        </div>

        <RouteStripe route={s.route} />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, paddingTop: 18, borderTop: "1px dashed #D8DCD9", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          <div>
            <div style={{ fontSize: 11, color: "#8B8F94" }}>Valid from</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1B1F23" }}>{s.pass.validFrom}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#8B8F94" }}>Valid until</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1B1F23" }}>{s.pass.validUntil}</div>
          </div>
        </div>
      </div>

      <div style={{ position: "relative", height: 0, borderTop: "2px dashed #D8DCD9" }}>
        <div style={{ position: "absolute", left: -10, top: -10, width: 20, height: 20, borderRadius: "50%", background: "#F2F4F3" }} />
        <div style={{ position: "absolute", right: -10, top: -10, width: 20, height: 20, borderRadius: "50%", background: "#F2F4F3" }} />
      </div>
      <div style={{ padding: "14px 24px", background: st.bg, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: st.fg }}>
          Issued for pickup at <strong>{s.route.pickupStop}</strong>
        </span>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.06em", color: st.fg, border: `1px solid ${st.fg}`, padding: "3px 8px", borderRadius: 3 }}>
          {s.pass.status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

function NotificationBanner({ status }) {
  const copy = {
    Active: "Your bus pass is active. Show this pass to the conductor when boarding.",
    Pending: "Your transport request is awaiting admin approval. You'll be notified once a bus is assigned.",
    Expired: "Your bus pass has expired. Apply for renewal from the transport office.",
    Rejected: "Your transport request was not approved. Contact the transport office for details.",
  }[status];
  const st = STATUS_STYLE[status] || STATUS_STYLE.Pending;
  return (
    <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 4, background: st.bg, color: st.fg, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>
      {copy}
    </div>
  );
}

function AlumniCard({ alum }) {
  const st = STATUS_STYLE.Alumni;
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E1E4E1", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ background: "#40454C", color: "#fff", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, letterSpacing: "0.04em", opacity: 0.75 }}>Alumni Record</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700 }}>{alum.alumniId}</div>
        </div>
        <StatusPill status="Alumni" />
      </div>
      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EFEFF0", color: "#40454C", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
            {alum.initials}
          </div>
          <div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 17, color: "#1B1F23" }}>{alum.name}</div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#6B7078", marginTop: 2 }}>
              {alum.department} · Class of {alum.graduationYear}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, marginTop: 22, paddingTop: 18, borderTop: "1px dashed #D8DCD9" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <BusBadge label={alum.lastBus.label} />
            <div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#8B8F94" }}>Last assigned bus</div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#1B1F23" }}>{alum.lastBus.number}</div>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#8B8F94" }}>Last route</div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#1B1F23" }}>
              {alum.lastRoute.number} · {alum.lastRoute.name}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#6B7078" }}>
          Pickup stop was <strong>{alum.lastRoute.pickupStop}</strong>.
        </div>

        <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px dashed #D8DCD9" }}>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#8B8F94" }}>Transport service concluded</div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#1B1F23" }}>{alum.serviceEnded}</div>
        </div>
      </div>

      <div style={{ padding: "14px 24px", background: st.bg, color: st.fg, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12 }}>
        This account is archived for reference only — alumni are not eligible for active bus passes.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
function LoginScreen({ onLogin }) {
  const [role, setRole] = useState("student");
  const [idValue, setIdValue] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  const fieldLabels = {
    student: { id: "Student ID", secret: "Password", idPh: "e.g. 24JECS212", secretPh: "Your password" },
    parent: { id: "Child's Student ID", secret: "Parent access code", idPh: "e.g. 24JECS212", secretPh: "4-digit code" },
    alumni: { id: "Alumni ID", secret: "Password", idPh: "e.g. 22JEME090", secretPh: "Your password" },
  }[role];

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const id = idValue.trim().toUpperCase();
    const value = secret.trim();

    if (role === "student") {
      const match = STUDENTS.find((s) => s.studentId === id);
      if (match && match.password === value) return onLogin({ role, data: match });
      setError("That student ID and password don't match our records.");
    } else if (role === "parent") {
      const match = STUDENTS.find((s) => s.studentId === id);
      if (match && match.parentCode === value) return onLogin({ role, data: match });
      setError("That student ID and access code don't match our records.");
    } else {
      const match = ALUMNI.find((a) => a.alumniId === id);
      if (match && match.password === value) return onLogin({ role, data: match });
      setError("That alumni ID and password don't match our records.");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      <div style={{ display: "flex", borderRadius: 4, overflow: "hidden", border: "1px solid #D8DCD9", marginBottom: 20 }}>
        {ROLES.map((r) => (
          <button
            key={r.id}
            onClick={() => { setRole(r.id); setError(""); setIdValue(""); setSecret(""); }}
            style={{
              flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
              fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 600,
              background: role === r.id ? "#14213D" : "#fff",
              color: role === r.id ? "#fff" : "#6B7078",
              borderRight: r.id !== "alumni" ? "1px solid #D8DCD9" : "none",
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid #E1E4E1", borderRadius: 4, padding: 24 }}>
        <label style={{ display: "block", marginBottom: 16 }}>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#1B1F23" }}>{fieldLabels.id}</span>
          <input
            value={idValue}
            onChange={(e) => setIdValue(e.target.value)}
            placeholder={fieldLabels.idPh}
            autoComplete="username"
            style={{
              display: "block", width: "100%", marginTop: 6, padding: "10px 12px",
              border: "1px solid #D8DCD9", borderRadius: 4,
              fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#1B1F23",
              background: "#FAFBFA",
            }}
          />
        </label>
        <label style={{ display: "block", marginBottom: 20 }}>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#1B1F23" }}>{fieldLabels.secret}</span>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder={fieldLabels.secretPh}
            autoComplete="current-password"
            style={{
              display: "block", width: "100%", marginTop: 6, padding: "10px 12px",
              border: "1px solid #D8DCD9", borderRadius: 4,
              fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#1B1F23",
              background: "#FAFBFA",
            }}
          />
        </label>
        {error && (
          <div style={{ marginBottom: 16, padding: "10px 12px", borderRadius: 4, background: "#F6E4E2", color: "#B3392F", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          style={{
            width: "100%", padding: "12px 0", border: "none", borderRadius: 4, cursor: "pointer",
            background: "#14213D", color: "#fff",
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15,
          }}
        >
          Sign in
        </button>
      </form>

      <div style={{ marginTop: 16, textAlign: "center", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#8B8F94" }}>
        Demo credentials are listed in the README.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
export default function JPRBusApp() {
  const [session, setSession] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#F2F4F3", padding: "32px 16px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, letterSpacing: "0.12em", color: "#1F7A6C", fontWeight: 600 }}>
            JPR COLLEGE
          </div>
          <h1 style={{ margin: "6px 0 0", fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: "#14213D", letterSpacing: "-0.02em" }}>
            Transport Portal
          </h1>
          <p style={{ margin: "6px 0 0", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#6B7078" }}>
            Bus pass status · Routes · Parent access
          </p>
        </header>

        {!session && <LoginScreen onLogin={setSession} />}

        {session && session.role === "student" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#6B7078" }}>
                Welcome back, {session.data.name.split(" ")[0]}
              </span>
              <button onClick={() => setSession(null)} style={{ background: "none", border: "1px solid #D8DCD9", borderRadius: 4, padding: "6px 12px", fontSize: 13, cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", color: "#6B7078" }}>
                Log out
              </button>
            </div>
            <PassCard student={session.data} />
            <NotificationBanner status={session.data.pass.status} />
          </div>
        )}

        {session && session.role === "parent" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#6B7078" }}>
                Viewing {session.data.name}'s transport details
              </span>
              <button onClick={() => setSession(null)} style={{ background: "none", border: "1px solid #D8DCD9", borderRadius: 4, padding: "6px 12px", fontSize: 13, cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", color: "#6B7078" }}>
                Log out
              </button>
            </div>
            <PassCard student={session.data} viewerLabel="Parent View · Transport Pass" />
            <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 4, background: "#EAF0F5", color: "#2C5F8A", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>
              This is a read-only view. Contact the transport office for any changes to pickup stop or route.
            </div>
          </div>
        )}

        {session && session.role === "alumni" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
              <button onClick={() => setSession(null)} style={{ background: "none", border: "1px solid #D8DCD9", borderRadius: 4, padding: "6px 12px", fontSize: 13, cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", color: "#6B7078" }}>
                Log out
              </button>
            </div>
            <AlumniCard alum={session.data} />
          </div>
        )}
      </div>
    </div>
  );
}
