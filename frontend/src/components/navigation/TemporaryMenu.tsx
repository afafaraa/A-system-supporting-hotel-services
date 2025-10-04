import LanguageSwitcher from "../ui/LanguageSwitcher.tsx";

function TemporaryMenu() {
  return (
    <div style={{ position: 'fixed', bottom: 4, left: 4 }}>
      <LanguageSwitcher />
    </div>
  );
}

export default TemporaryMenu;
