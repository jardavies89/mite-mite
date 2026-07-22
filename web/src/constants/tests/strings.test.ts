import { translate } from "../strings";

describe("translate", () => {
  test("returns the string unchanged when no vars provided", () => {
    expect(translate("Hello world")).toBe("Hello world");
  });

  test("replaces unmatched placeholder with its key name when vars is empty", () => {
    expect(translate("Hello %{name}", {})).toBe("Hello name");
  });

  test("substitutes a single placeholder with the matching var", () => {
    expect(translate("Vol. %{n}", { n: "3" })).toBe("Vol. 3");
  });

  test("substitutes multiple distinct placeholders", () => {
    expect(translate("%{a} and %{b}", { a: "foo", b: "bar" })).toBe("foo and bar");
  });

  test("substitutes the same placeholder multiple times", () => {
    expect(translate("%{x}-%{x}", { x: "hi" })).toBe("hi-hi");
  });

  test("leaves unmatched placeholders as the key name", () => {
    expect(translate("Hello %{unknown}", { name: "world" })).toBe("Hello unknown");
  });

  test("does not alter text outside of placeholders", () => {
    expect(translate("prefix %{val} suffix", { val: "middle" })).toBe("prefix middle suffix");
  });
});
