export interface IRequestRajaOngkir {
  origin: string;
  destination: string;
  weight: number;
  courier: string;
}

interface CostDetail {
  value: number;
  etd: string;
  note: string;
}

interface Cost {
  service: string;
  description: string;
  cost: CostDetail[];
}

interface Courier {
  code: string;
  name: string;
  costs: Cost[];
}

interface LocationDetails {
  city_id: string;
  province_id: string;
  province: string;
  type: string;
  city_name: string;
  postal_code: string;
}

interface RajaOngkirResult {
  code: number;
  description: string;
}

export interface RajaOngkirResponse {
  rajaongkir: {
    query: IRequestRajaOngkir;
    status: RajaOngkirResult;
    origin_details: LocationDetails;
    destination_details: LocationDetails;
    results: Courier[];
  };
}
