import PrimaryHeader from "@/components/header";

function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PrimaryHeader />
      <main className="flex-1 overflow-y-auto flex flex-col items-center">{children}</main>
    </>
  );
}

export { PageLayout };
