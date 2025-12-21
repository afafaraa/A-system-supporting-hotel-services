import {NotificationVariant} from "./types/notification.ts";

function IconsTest() {
  const variants = ["NOTICE", "CONFIRMATION", "ALERT", "FAILURE", "ADVERTISEMENT"] as const;
  return (
    <div style={{ display: 'flex', gap: '32px', padding: '20px' }}>
      {variants.map((variant: string) => {
        const {icon: Icon, color} = NotificationVariant[variant];
        return (
          <Icon key={variant} sx={{fontSize: "64px"}} color={color} />
        );
      })}
    </div>
  );
}

export default IconsTest;
