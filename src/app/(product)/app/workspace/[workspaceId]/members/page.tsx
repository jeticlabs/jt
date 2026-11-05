interface Member {
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member" | "Viewer";
  status: "Active" | "Invited";
}

const MEMBERS: Member[] = [
  { name: "Oyewale Prudence", email: "oyewale@jetic.dev", role: "Owner", status: "Active" },
  { name: "Ada Okonkwo", email: "ada@jetic.dev", role: "Admin", status: "Active" },
  { name: "Tunde Alabi", email: "tunde@jetic.dev", role: "Member", status: "Active" },
  { name: "Mina Park", email: "mina@jetic.dev", role: "Viewer", status: "Invited" },
];

const primaryButton =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-white px-3 text-[12px] font-semibold text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

const fieldLabel = "jetic-muted mb-2 block text-[12px]";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function MembersPage() {
  return (
    <div className="jetic-surface min-h-full w-full px-6 pb-16 pt-6 lg:px-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[20px] font-semibold tracking-tight text-white">Members</h1>
          <p className="jetic-muted text-[13px]">
            Invite teammates and control what they can do in this workspace.
          </p>
        </div>
        <button type="button" className={primaryButton}>
          Invite member
        </button>
      </header>

      <section className="jetic-card mt-6 bg-[var(--jetic-recess)]">
        <div className="flex flex-wrap items-end gap-3 border-b border-white/10 p-4">
          <div className="min-w-[220px] flex-1">
            <label htmlFor="invite-email" className={fieldLabel}>
              Email address
            </label>
            <input
              id="invite-email"
              type="email"
              placeholder="teammate@company.com"
              className="jetic-input h-10 text-[13px]"
            />
          </div>
          <div className="w-[150px]">
            <label htmlFor="invite-role" className={fieldLabel}>
              Role
            </label>
            <select
              id="invite-role"
              defaultValue="member"
              className="jetic-input h-10 text-[13px] text-white"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <button type="submit" className={`${primaryButton} h-10`}>
            Send invite
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.12em] text-[var(--jetic-faint)]">
                <th scope="col" className="px-4 py-2.5 font-medium">Member</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Role</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MEMBERS.map((member) => (
                <tr
                  key={member.email}
                  className="border-b border-white/[0.06] last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--jetic-well)] text-[11px] font-semibold text-white"
                      >
                        {initials(member.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-white">{member.name}</p>
                        <p className="jetic-muted truncate text-[12px]">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex h-6 items-center rounded-full border border-white/10 px-2.5 text-[11.5px] font-medium text-[var(--jetic-emphasis)]">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[12px] ${
                        member.status === "Active" ? "text-[var(--jetic-emphasis)]" : "jetic-muted"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${
                          member.status === "Active" ? "bg-white" : "bg-[var(--jetic-faint)]"
                        }`}
                      />
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="rounded-lg px-2 py-1 text-[12px] font-medium text-[var(--jetic-muted)] transition-colors hover:bg-[var(--jetic-well)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
