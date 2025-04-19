import { UIBuilder } from "./base";
import { Image, Chip } from "@melony/ui";
import { ChipProps } from "@melony/ui";

export class ImageBuilder extends UIBuilder {
  constructor(src?: string, alt?: string) {
    super(Image);
    if (src && alt) {
      this._props = { src, alt };
    }
  }

  src(src: string) {
    this._props.src = src;
    return this;
  }

  alt(alt: string) {
    this._props.alt = alt;
    return this;
  }
}

export class ChipBuilder extends UIBuilder {
  constructor(props?: ChipProps) {
    super(Chip);
    if (props) {
      this._props = { ...props };
    } else {
      this._props = { variant: "default" };
    }
  }

  label(label: string) {
    this._props.label = label;
    return this;
  }

  variant(variant: string) {
    this._props.variant = variant;
    return this;
  }
}

export const image = (src: string, alt: string) => {
  return new ImageBuilder(src, alt);
};

export const chip = (props: ChipProps) => {
  return new ChipBuilder(props);
}; 