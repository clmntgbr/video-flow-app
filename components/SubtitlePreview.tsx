import useConfigurationContext from "@/store/context/configurations/hooks";
import { Configuration } from "@/store/interface/configuration";

interface SubtitlePreviewProps {
  settings: Configuration;
  thumbnail: string;
}

export function SubtitlePreview({ settings, thumbnail }: SubtitlePreviewProps) {
  const { configuration } = useConfigurationContext();

  console.log(settings);

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
    if (settings.subtitleShadow === "0") return "none";
    const shadowSize =
      {
        "1": "2px",
        "2": "4px",
        "3": "6px",
      }[settings.subtitleShadow] || "4px";

    return `0 0 ${shadowSize} ${settings.subtitleShadowColor}`;
  };

  const getOutline = () => {
    if (settings.subtitleOutlineThickness === "0") return `0px ${settings.subtitleOutlineColor}`;
    const thickness =
      {
        "1": "1px",
        "2": "2px",
        "3": "3px",
      }[settings.subtitleOutlineThickness] || "2px";

    return `${thickness} ${settings.subtitleOutlineColor}`;
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="relative h-full aspect-video rounded-lg overflow-hidden bg-gray-900">
        <img src={thumbnail} alt="Aperçu" className="w-full h-full object-cover" />
        <div
          className="absolute bottom-8 left-0 right-0 text-center px-4"
          style={{
            fontFamily: getFontFamily(),
            fontSize: settings.subtitleSize + "px",
            color: settings.subtitleColor,
            fontWeight: settings.subtitleBold === "1" ? "bold" : "normal",
            fontStyle: settings.subtitleItalic === "1" ? "italic" : "normal",
            textDecoration: settings.subtitleUnderline === "1" ? "underline" : "none",
            textShadow: getShadow(),
            WebkitTextStroke: getOutline(),
          }}
        >
          Exemple de sous-titre avec <br /> la configuration actuelle
        </div>
      </div>
    </div>
  );
}
