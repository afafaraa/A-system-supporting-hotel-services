type TypeProp = { type: string; }

export interface OptionObject {
  label: string;
  description: string;
  price: number;
  image?: string;
}

export interface SelectionAttributes extends TypeProp {
  multipleSelection: boolean;
  options: Record<string, OptionObject[]>;
}

export interface SelectionAttributesResponse extends TypeProp {
  selectedOptions: Record<string, number>;
}

export type ServiceDetails = SelectionAttributes;

export type ServiceDetailsResponse = SelectionAttributesResponse;
