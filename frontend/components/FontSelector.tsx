import { useEffect, useState } from "react";

interface Font {
  family: string;
}

interface Props {
  onFontChange?: (font: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

export default function FontSelector({ onFontChange, style, className }: Props) {
  const [fonts, setFonts] = useState<Font[]>([]);

  useEffect(() => {
    const systemFonts: Font[] = [
      { family: "Arial" },
      { family: "Verdana" },
      { family: "Tahoma" },
      { family: "Trebuchet MS" },
      { family: "Georgia" },
      { family: "Times New Roman" },
      { family: "Courier New" },
      { family: "Impact" },
      { family: "Segoe UI" },
      { family: "Lucida Console" }
    ];

    const fetchFonts = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY}`
        );
        const data = await res.json();
        const googleFonts: Font[] = data.items || [];

        // Merge system + Google fonts
        setFonts([...systemFonts, ...googleFonts]);
      } catch (err) {
        console.error("Failed to fetch fonts:", err);
        // Fallback to system fonts only
        setFonts(systemFonts);
      }
    };

    fetchFonts();
  }, []);

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value;

    const linkId = "google-font-link";
    let link = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(
      /\s+/g,
      "+"
    )}&display=swap`;

    onFontChange?.(font);
  };

  return (
    <select
      className={className}
      name="font-selector"
      onChange={handleFontChange}
      style={style}
      value="Times New Roman"
    >
      {fonts.map((font) => (
        <option key={font.family} value={font.family}>
          {font.family}
        </option>
      ))}
    </select>
  );
}
