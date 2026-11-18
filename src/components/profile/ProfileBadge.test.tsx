import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import nl from "@/locales/nl.json";
import { ProfileBadge } from "./ProfileBadge";

const dict = nl as unknown as Record<string, string>;
vi.mock("@/lib/i18n", () => ({ useI18n: () => ({ locale: "nl", t: (k: string) => dict[k] ?? k }) }));
afterEach(cleanup);

function open(name: string) {
  fireEvent.click(screen.getByRole("button", { name }));
  return screen.getByRole("dialog");
}

describe("verification card behind the profile marks", () => {
  it("blue mark verified by the ROUT team shows name, country, month and the team text", () => {
    render(<ProfileBadge type="verified" method="team" legalName="Jona Delplanche" country="be" verifiedAt="2026-10-10T08:16:00Z" size="sm" />);
    const card = open("Officieel geverifieerd lid");
    expect(card.textContent).toContain("Officieel geverifieerd lid");
    expect(card.textContent).toContain("Jona Delplanche · BE");
    expect(card.textContent).toContain("Geverifieerd in oktober 2026");
    expect(card.textContent).toContain("Geverifieerd door het ROUT-team");
    expect(card.textContent).toContain("Identiteit is gecontroleerd en bevestigd door het ROUT-team.");
  });

  it("blue mark from Didit says it was validated through Didit", () => {
    render(<ProfileBadge type="verified" method="didit" legalName="Anna Peeters" country="BE" verifiedAt="2026-11-02T10:00:00Z" size="sm" />);
    const card = open("Officieel geverifieerd lid");
    expect(card.textContent).toContain("Anna Peeters · BE");
    expect(card.textContent).toContain("Geverifieerd in november 2026");
    expect(card.textContent).toContain("gevalideerd via ROUT met Didit");
    expect(card.textContent).not.toContain("ROUT-team");
  });

  it("white mark on a private alias never shows a name or country", () => {
    render(<ProfileBadge type="linked" legalName="Jona Delplanche" country="BE" verifiedAt="2026-10-10T08:16:00Z" size="sm" />);
    const card = open("Gekoppeld aan geverifieerd hoofdaccount");
    expect(card.textContent).toContain("Echt mens met geverifieerd hoofdprofiel");
    expect(card.textContent).toContain("Anonimiteit gegarandeerd");
    expect(card.textContent).not.toContain("Jona");
    expect(card.textContent).not.toContain("BE");
  });

  it("green shield explains the zero-knowledge proof without personal data", () => {
    render(<ProfileBadge type="human" legalName="Jona Delplanche" country="BE" size="sm" />);
    const card = open("Geverifieerd mens");
    expect(card.textContent).toContain("Cryptografisch ZK-menselijkheidsbewijs");
    expect(card.textContent).not.toContain("Jona");
  });
});
