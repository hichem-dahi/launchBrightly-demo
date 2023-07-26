export interface IBaremetrics {
  id: string;
  name: string;
  active: boolean;
  tagline: string;
  description: string;
  URL: string;
  modeDesktopLight: boolean | null;
  modeDesktopDark: boolean | null;
  modeLaptopLight: boolean | null;
  modeLaptopDark: boolean | null;
  modeMobileLight: boolean | null;
  modeMobileDark: boolean | null;
  editions: { 
    items: IItemEdition[] 
  };
  features: {
    items: IItemFeature[];
  }
}

export interface IEditions {
  items: IItemEdition[];
}

export interface IItemEdition {
  id: string;
  name: string;
  description:  string;
}

export interface IItemFeature {
  id: string
  name: string,
  active: boolean,
  description: string,
  URL: string | null,
  selector: string | null,
  takeScreenshot: string |  null,
  filename: string | null,
  screenshots: {
    items: IScreenshot[]
  };
  FeatureEditions: {  
    items: { edition: IFeatureEdition }[]
  }
}

export interface IScreenshot{
  status: string | null;
  mode: string | null;
  timeOfCapture: string | null;
  filekeyRaw: string| null;
  filekeyStyled: string | null;
  filesize: number | null;
}

export interface IFeatureEdition {
  id: string,
  name: string
}
