import {
  getStatusFromId,
  getStatusColor,
  getStatusBg,
} from "../utils/statusUtils";

describe("Status Utilities", () => {
  describe("getStatusFromId", () => {
    it("should return correct status for ID", () => {
      expect(getStatusFromId(1)).toBe("en_attente");
      expect(getStatusFromId(2)).toBe("en_cours");
      expect(getStatusFromId(3)).toBe("terminé");
    });

    it("should return 'en_attente' for invalid ID", () => {
      expect(getStatusFromId(999)).toBe("en_attente");
    });
  });

  describe("getStatusColor", () => {
    it("should return correct color classes", () => {
      expect(getStatusColor("en_attente")).toBe("border-yellow-500");
      expect(getStatusColor("en_cours")).toBe("border-blue-500");
      expect(getStatusColor("terminé")).toBe("border-green-500");
    });
  });

  describe("getStatusBg", () => {
    it("should return correct background classes", () => {
      expect(getStatusBg("en_attente")).toBe("bg-yellow-500/10");
      expect(getStatusBg("en_cours")).toBe("bg-blue-500/10");
      expect(getStatusBg("terminé")).toBe("bg-green-500/10");
    });
  });
});
