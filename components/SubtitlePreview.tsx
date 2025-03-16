import useConfigurationContext from "@/store/context/configurations/hooks";
import { Configuration } from "@/store/interface/configuration";

interface SubtitlePreviewProps {
  settings: Configuration;
  thumbnail: string;
}

export function SubtitlePreview({ settings, thumbnail }: SubtitlePreviewProps) {
  const { configuration } = useConfigurationContext();

  const getFontSize = () => {
    switch (settings.subtitleSize) {
      case "small":
        return "24px";
      case "medium":
        return "32px";
      case "large":
        return "40px";
      default:
        return "32px";
    }
  };

  const getFontFamily = () => {
    switch (settings.subtitleFont) {
      case "ARIAL":
        return "Arial";
      case "TIMES_NEW_ROMAN":
        return "Times New Roman";
      case "COURIER_NEW":
        return "Courier New";
      default:
        return "Arial";
    }
  };

  const getShadow = () => {
    if (settings.subtitleShadow === "SHADOW_NONE") return "none";
    const shadowSize =
      {
        SHADOW_SOFT: "2px",
        SHADOW_MEDIUM: "4px",
        SHADOW_HARD: "6px",
      }[settings.subtitleShadow] || "4px";

    return `0 0 ${shadowSize} ${settings.subtitleShadowColor}`;
  };

  const getOutline = () => {
    if (settings.subtitleOutlineThickness === "OUTLINE_NONE") return "none";
    const thickness =
      {
        OUTLINE_SOFT: "1px",
        OUTLINE_MEDIUM: "2px",
        OUTLINE_HARD: "3px",
      }[settings.subtitleOutlineThickness] || "2px";

    return `${thickness} ${settings.subtitleOutlineColor}`;
  };

  console.log(settings);

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900">
      <img src={thumbnail} alt="Aperçu" className="w-full h-full object-cover" />
      <div
        className="absolute bottom-8 left-0 right-0 text-center px-4"
        style={{
          fontFamily: getFontFamily(),
          fontSize: getFontSize(),
          color: settings.subtitleColor,
          fontWeight: settings.subtitleBold === "1" ? "bold" : "normal",
          fontStyle: settings.subtitleItalic === "1" ? "italic" : "normal",
          textDecoration: settings.subtitleUnderline === "1" ? "underline" : "none",
          textShadow: getShadow(),
          WebkitTextStroke: getOutline(),
        }}
      >
        Exemple de sous-titre avec
        <br />
        la configuration actuelle
      </div>
    </div>
  );
}
