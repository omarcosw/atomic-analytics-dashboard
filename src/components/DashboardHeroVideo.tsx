import { loginHeroConfig } from "@/data/loginHero";

export const DashboardHeroVideo = () => {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      poster={loginHeroConfig.posterUrl}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      style={{ opacity: loginHeroConfig.overlayOpacity }}
    >
      <source src={loginHeroConfig.videoUrl} type="video/mp4" />
    </video>
  );
};
