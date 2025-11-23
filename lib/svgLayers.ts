import { FoilType } from "./pricing";

export interface LayerArea {
  layerName: string;
  areaM2: number;
  suggestedFoil: FoilType;
}

export interface SvgParseResult {
  layers: LayerArea[];
  totalAreaM2: number;
  warnings: string[];
}

const UNIT_TO_METERS: Record<string, number> = {
  m: 1,
  cm: 0.01,
  mm: 0.001,
  in: 0.0254,
  pt: 0.0254 / 72,
  px: 0.0002645833, // 96 dpi standaard
};

function parseLengthToMeters(length: string | null): number | undefined {
  if (!length) return undefined;
  const match = length.trim().match(/^([0-9]+(?:\.[0-9]+)?)([a-z%]*)$/i);
  if (!match) return undefined;

  const value = Number.parseFloat(match[1]);
  const unit = match[2].toLowerCase() || "px";
  const multiplier = UNIT_TO_METERS[unit];
  if (!multiplier) return undefined;
  return value * multiplier;
}

function getMeterPerUnit(svg: SVGSVGElement): number {
  const viewBox = svg.viewBox.baseVal;
  const viewBoxWidth = viewBox?.width || 0;
  const viewBoxHeight = viewBox?.height || 0;

  const widthMeters = parseLengthToMeters(svg.getAttribute("width"));
  const heightMeters = parseLengthToMeters(svg.getAttribute("height"));

  if (viewBoxWidth > 0 && widthMeters !== undefined) {
    return widthMeters / viewBoxWidth;
  }

  if (viewBoxHeight > 0 && heightMeters !== undefined) {
    return heightMeters / viewBoxHeight;
  }

  if (widthMeters && heightMeters && viewBoxWidth && viewBoxHeight) {
    return (widthMeters / viewBoxWidth + heightMeters / viewBoxHeight) / 2;
  }

  return UNIT_TO_METERS["px"];
}

function numberFromAttr(element: Element, key: string): number {
  const raw = element.getAttribute(key);
  return raw ? Number.parseFloat(raw) || 0 : 0;
}

function polygonArea(points: DOMPoint[]): number {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y - points[j].x * points[i].y;
  }
  return Math.abs(area / 2);
}

function collectPoints(pointsAttr: string | null): DOMPoint[] {
  if (!pointsAttr) return [];
  const tokens = pointsAttr
    .trim()
    .split(/\s+/)
    .map((pair) => pair.split(",").map((p) => Number.parseFloat(p)));

  return tokens
    .filter((coords) => coords.length === 2 && coords.every((c) => Number.isFinite(c)))
    .map(([x, y]) => new DOMPoint(x, y));
}

function elementAreaInUnits(element: Element): number {
  const tag = element.tagName.toLowerCase();

  switch (tag) {
    case "rect": {
      const width = numberFromAttr(element, "width");
      const height = numberFromAttr(element, "height");
      return Math.max(width, 0) * Math.max(height, 0);
    }
    case "circle": {
      const radius = numberFromAttr(element, "r");
      return Math.PI * radius * radius;
    }
    case "ellipse": {
      const rx = numberFromAttr(element, "rx");
      const ry = numberFromAttr(element, "ry");
      return Math.PI * rx * ry;
    }
    case "polygon": {
      const points = collectPoints(element.getAttribute("points"));
      return polygonArea(points);
    }
    case "polyline": {
      const points = collectPoints(element.getAttribute("points"));
      if (points.length >= 3) {
        points.push(points[0]);
        return polygonArea(points);
      }
      return 0;
    }
    case "line": {
      return 0;
    }
    case "path":
    default: {
      const svgElement = element as SVGGraphicsElement;
      try {
        const bbox = svgElement.getBBox();
        return bbox.width * bbox.height;
      } catch {
        return 0;
      }
    }
  }
}

function suggestFoilType(name: string): FoilType {
  const lowered = name.toLowerCase();
  if (lowered.includes("wrap")) return "Wrap";
  if (lowered.includes("letter")) return "Belettering";
  return "Onbekend";
}

export function parseSvgLayers(svgText: string): SvgParseResult {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.width = "0";
  container.style.height = "0";
  container.style.overflow = "hidden";
  container.innerHTML = svgText;

  const svg = container.querySelector("svg");
  if (!svg) {
    throw new Error("Het SVG-bestand bevat geen <svg>-element.");
  }

  svg.style.position = "absolute";
  svg.style.visibility = "hidden";
  document.body.appendChild(svg);

  const warnings: string[] = [];
  const meterPerUnit = getMeterPerUnit(svg);
  const shapesSelector = "rect,circle,ellipse,polygon,polyline,path,line";

  const topLevelGroups = Array.from(svg.children).filter(
    (child): child is SVGGElement => child.tagName.toLowerCase() === "g",
  );
  const layersToProcess = topLevelGroups.length > 0 ? topLevelGroups : [svg];
  const seenShapes = new Set<Element>();

  const layers: LayerArea[] = layersToProcess.map((layer, index) => {
    const layerName =
      layer.getAttribute("inkscape:label") ||
      layer.getAttribute("data-layer") ||
      layer.getAttribute("id") ||
      `Laag ${index + 1}`;

    const shapes = Array.from(layer.querySelectorAll(shapesSelector));
    shapes.forEach((shape) => seenShapes.add(shape));

    const areaUnits = shapes.reduce((sum, el) => sum + elementAreaInUnits(el), 0);
    const areaM2 = areaUnits * meterPerUnit * meterPerUnit;

    return {
      layerName,
      areaM2,
      suggestedFoil: suggestFoilType(layerName),
    };
  });

  const remainingShapes = Array.from(svg.querySelectorAll(shapesSelector)).filter(
    (shape) => !seenShapes.has(shape),
  );

  if (remainingShapes.length > 0) {
    const areaUnits = remainingShapes.reduce((sum, el) => sum + elementAreaInUnits(el), 0);
    layers.push({
      layerName: "Oningedeeld", 
      areaM2: areaUnits * meterPerUnit * meterPerUnit,
      suggestedFoil: "Onbekend",
    });
    warnings.push("Er zijn elementen gevonden die niet in een laag gegroepeerd zijn.");
  }

  document.body.removeChild(svg);

  const totalAreaM2 = layers.reduce((sum, layer) => sum + layer.areaM2, 0);

  return { layers, totalAreaM2, warnings };
}
