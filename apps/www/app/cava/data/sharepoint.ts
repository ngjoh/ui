"use client";


import {CateringProvider, Company, Country, Currency, Item, ItemGroup, Order, OrderItem, Room, WorkOrder, WorkorderItem } from "./schemas";
import { https } from "@/lib/httphelper";

export interface Root<T> {
    "@odata.context": string;
    "@odata.count": number;
    "@microsoft.graph.tips": string;
    value: T[];
}

// Generated by https://transform.tools/json-to-typescript


export interface CreatedBy {
  user: User
}

export interface User {
  email: string
  id: string
  displayName: string
}

export interface LastModifiedBy {
  user: User
}



export interface ParentReference {
  id: string
  siteId: string
}

export interface ContentType {
  id: string
  name: string
}

export interface ItemHeader<T> {
  "@odata.etag": string
  createdDateTime: string
  eTag: string
  id: string
  lastModifiedDateTime: string
  webUrl: string
  createdBy: CreatedBy
  lastModifiedBy: LastModifiedBy
  parentReference: ParentReference
  contentType: ContentType
  "fields@odata.context": string
  fields: T
}
export interface LookupValue {
  LookupId: number
  LookupValue: string
}
export interface CateringProviderFields {
  "@odata.etag": string
  Title: string
  LinkTitleNoMenu: string
  LinkTitle: string
  email: string
  OrderPage?: string
  Notes?: string
  Isstandalone?: boolean
  LocalCurrency?: string
  Opening?: number
  Closing?: number
  Is_x0020_Reception?: boolean
  id: string
  ContentType: string
  Modified: string
  Created: string
  AuthorLookupId: string
  EditorLookupId: string
  _UIVersionString: string
  Attachments: boolean
  Edit: string
  ItemChildCount: string
  FolderChildCount: string
  _ComplianceFlags: string
  _ComplianceTag: string
  _ComplianceTagWrittenTime: string
  _ComplianceTagUserId: string
}

export async function getCateringProviders(accessToken: string) : Promise<CateringProvider[]>{
  const items = await https<Root<ItemHeader<CateringProviderFields>>>(accessToken, "GET",
    `https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com:/sites/cava3:/lists/Catering%20Providers/items?$expand=fields`);
    return items.data?.value.map((item) => {
    const { fields } = item;
    const provider: CateringProvider = {
      id: item.id,
      name: fields.Title,
      email: fields.email
    };
    return provider;
  }) ?? [];

}

export interface CompanyFields {
  "@odata.etag": string
  Title: string
  field_1?: string
  field_2?: string
  PrimaryLocationLookupId?: string
  id: string
  ContentType: string
  Modified: string
  Created: string
  AuthorLookupId: string
  EditorLookupId: string
  _UIVersionString: string
  Attachments: boolean
  Edit: string
  LinkTitleNoMenu: string
  LinkTitle: string
  ItemChildCount: string
  FolderChildCount: string
  _ComplianceFlags: string
  _ComplianceTag: string
  _ComplianceTagWrittenTime: string
  _ComplianceTagUserId: string
}

export async function getCompanies(accessToken: string) {
  const items = await https<Root<ItemHeader<CompanyFields>>>(accessToken, "GET",
    `https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com:/sites/cava3:/lists/Companies/items?$expand=fields`);
    return items.data?.value.map((item) => {
    const { fields } = item;
    const company: Company = {
      id: ""
    };
    return company;
  });

}

export interface CountryFields {
  "@odata.etag": string
  Title: string
  Countrycode: string
  Flag?: string
  Locations: Location[]
  id: string
  ContentType: string
  Modified: string
  Created: string
  AuthorLookupId: string
  EditorLookupId: string
  _UIVersionString: string
  Attachments: boolean
  Edit: string
  LinkTitleNoMenu: string
  LinkTitle: string
  ItemChildCount: string
  FolderChildCount: string
  _ComplianceFlags: string
  _ComplianceTag: string
  _ComplianceTagWrittenTime: string
  _ComplianceTagUserId: string
}

export interface Location {
  LookupId: number
  LookupValue: string
}

export async function getCountries(accessToken: string) {
  const items = await https<Root<ItemHeader<CountryFields>>>(accessToken, "GET",
    `https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com:/sites/cava3:/lists/Countries/items?$expand=fields`);
    return items.data?.value.map((item) => {
    const { fields } = item;
    const country: Country = {
      id: ""
    };
    return country;
  });

}


export interface CurrencyFields {
  "@odata.etag": string
  Title: string
  LinkTitle: string
  EURrate: number
  id: string
  ContentType: string
  Modified: string
  Created: string
  AuthorLookupId: string
  EditorLookupId: string
  _UIVersionString: string
  Attachments: boolean
  Edit: string
  LinkTitleNoMenu: string
  ItemChildCount: string
  FolderChildCount: string
  _ComplianceFlags: string
  _ComplianceTag: string
  _ComplianceTagWrittenTime: string
  _ComplianceTagUserId: string
}
export async function getCurrencies(accessToken: string) : Promise<Currency[]> {
  const items = await https<Root<ItemHeader<CurrencyFields>>>(accessToken, "GET",
    `https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com:/sites/cava3:/lists/Currency/items?$expand=fields`);
    return items.data?.value.map((item) => {
    const { fields } = item;
    const currency: Currency = {
      id: item.id,
      name: fields.Title,
      rate: fields.EURrate
    };
    return currency;
  }) ?? [];

}

export interface ItemGroupFields {
  "@odata.etag": string
  Title: string
  Sort: number
  id: string
  ContentType: string
  Modified: string
  Created: string
  AuthorLookupId: string
  EditorLookupId: string
  _UIVersionString: string
  Attachments: boolean
  Edit: string
  LinkTitleNoMenu: string
  LinkTitle: string
  ItemChildCount: string
  FolderChildCount: string
  _ComplianceFlags: string
  _ComplianceTag: string
  _ComplianceTagWrittenTime: string
  _ComplianceTagUserId: string
}
export async function getItemGroups(accessToken: string) : Promise<ItemGroup[]>{
  const items = await https<Root<ItemHeader<ItemGroupFields>>>(accessToken, "GET",
    `https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com:/sites/cava3:/lists/ItemGroups/items?$expand=fields`);
    return items.data?.value.map((item) => {
    const { fields } = item;
    const provider: ItemGroup = {
      id: item.id
    };
    return provider;
  }) ?? [];

}

export interface WorkorderFields {
  "@odata.etag": string
  Title: string
  LinkTitleNoMenu: string
  LinkTitle: string
  Amount: number
  Sales_x0020_OrderLookupId: string
  WorkOrderHTML: string
  ProviderLookupId: string
  id: string
  ContentType: string
  Modified: string
  Created: string
  AuthorLookupId: string
  EditorLookupId: string
  _UIVersionString: string
  Attachments: boolean
  Edit: string
  ItemChildCount: string
  FolderChildCount: string
  _ComplianceFlags: string
  _ComplianceTag: string
  _ComplianceTagWrittenTime: string
  _ComplianceTagUserId: string
}

export async function getWorkOrders(accessToken: string,itemItems: Item[]) : Promise<WorkOrder[]>{
  const items = await https<Root<ItemHeader<WorkorderFields>>>(accessToken, "GET",
    `https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com:/sites/cava3:/lists/Catering%20Orders%20Work%20Orders/items?$expand=fields`);
    return items.data?.value.map((item) => {
    const { fields } = item;
    const provider: WorkOrder = {
      id: ""
    };
    return provider;
  }) ?? [];

}


export interface WorkOrderItemFields {
  "@odata.etag": string
  Title: string
  LinkTitleNoMenu: string
  LinkTitle: string
  ItemLookupId: string
  DeliveryDateandTime: string
  ProviderLookupId: string
  Quantity: number
  Pricepritem: number
  Catering_x0020_OrderLookupId?: string
  Status: string
  DeliverTo: string
  RoomLookupId?: string
  id: string
  ContentType: string
  Modified: string
  Created: string
  AuthorLookupId: string
  EditorLookupId: string
  _UIVersionString: string
  Attachments: boolean
  Edit: string
  ItemChildCount: string
  FolderChildCount: string
  _ComplianceFlags: string
  _ComplianceTag: string
  _ComplianceTagWrittenTime: string
  _ComplianceTagUserId: string
}
export async function getWorkOrderItems(accessToken: string) {
  const items = await https<Root<ItemHeader<WorkOrderItemFields>>>(accessToken, "GET",
    `https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com:/sites/cava3:/lists/Catering%20Orders%20Items/items?$expand=fields`);
    return items.data?.value.map((item) => {
    const { fields } = item;
    const provider: WorkorderItem = {
      id: ""
    };
    return provider;
  });

}

export interface ItemFields {
  "@odata.etag": string
  Title: string
  Price: number
  Description?: string
  Group: Group[]
  ProviderLookupId: string
  CurrencyLookupId?: string
  id: string
  ContentType: string
  Modified: string
  Created: string
  AuthorLookupId: string
  EditorLookupId: string
  _UIVersionString: string
  Attachments: boolean
  Edit: string
  LinkTitleNoMenu: string
  LinkTitle: string
  ItemChildCount: string
  FolderChildCount: string
  _ComplianceFlags: string
  _ComplianceTag: string
  _ComplianceTagWrittenTime: string
  _ComplianceTagUserId: string
}

export interface Group {
  LookupId: number
  LookupValue: string
}


export async function getItems(accessToken: string, providers : CateringProvider[],itemGroupsItems : ItemGroup[],currencyItems : Currency[]): Promise<Item[]> {
  const items = await https<Root<ItemHeader<ItemFields>>>(accessToken, "GET",
    `https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com:/sites/cava3:/lists/Items/items?$expand=fields`);
    return items.data?.value.map((item) => {
    const { fields } = item;
    const provider : CateringProvider = providers.find((p) => p.id === fields.ProviderLookupId) ?? {
      id: "",
      name: "",
      email: ""
    }

    const itemGroups : ItemGroup[] = itemGroupsItems.filter((p) => fields.Group.find((g) => g.LookupId === parseInt(p.id))) ?? []
    
    const i: Item = {
      id: item.id,
      name: fields.Title,
      providerId: fields.ProviderLookupId,
      provider,
      currency: currencyItems.find((p) => p.id === fields.CurrencyLookupId) ?? {} as Currency,
      itemGroups,
      description: fields.Description ?? "",
      price: fields.Price,
      comments: ""
    };
    return i;
  }) ?? [];

}



const lookupValues = (values:LookupValue[]) => {
  return values.map((value) => {
    return {LookupId: value.LookupId, LookupValue:value.LookupValue}
  }    );
}

export interface OrderFields {
  "@odata.etag": string
  Title: string
  LinkTitleNoMenu: string
  LinkTitle: string
  Appointmentstart: string
  OrderData?: string
  Organizer_x0020_Email: string
  Comments?: string
  ConfirmationHTML: string
  RoomLookupId: string
  id: string
  ContentType: string
  Modified: string
  Created: string
  AuthorLookupId: string
  EditorLookupId: string
  _UIVersionString: string
  Attachments: boolean
  Edit: string
  ItemChildCount: string
  FolderChildCount: string
  _ComplianceFlags: string
  _ComplianceTag: string
  _ComplianceTagWrittenTime: string
  _ComplianceTagUserId: string
}


export interface RoomFields {
  "@odata.etag": string
  id: string
  ContentType: string
  Title: string
  Modified: string
  Created: string
  AuthorLookupId: string
  EditorLookupId: string
  _UIVersionString: string
  Attachments: boolean
  Edit: string
  LinkTitleNoMenu: string
  LinkTitle: string
  ItemChildCount: string
  FolderChildCount: string
  _ComplianceFlags: string
  _ComplianceTag: string
  _ComplianceTagWrittenTime: string
  _ComplianceTagUserId: string
  Provisioning_x0020_Status: string
  Email?: string
  Capacity: number
  Price_x0020_ListLookupId?: string
  RestrictedTo?: string
  TeamsMeetingRoom?: boolean
  AppEditorLookupId?: string
  _IsRecord?: string
}


export async function getRooms(accessToken: string) : Promise<Room[]> {
  const items = await https<Root<ItemHeader<RoomFields>>>(accessToken, "GET",
    `https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com:/sites/cava3:/lists/Rooms/items?$expand=fields`);
    return items.data?.value.map((item) => {
    const { fields } = item;
    const room: Room = {
      id: item.id,
      name:fields.Title,
      email: fields.Email ?? ""
    };
    return room;
  }) ?? [];

}

export async function getOrders(accessToken: string,itemItems : Item[],rooms : Room[]) : Promise<Order[]>{
  const items = await https<Root<ItemHeader<OrderFields>>>(accessToken, "GET",
    `https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com:/sites/cava3:/lists/Catering%20Orders/items?$expand=fields`);
    return items.data?.value.map((item) => {
    const { fields } = item;
/**
114;3;10;510;Nuts (small bags)
115;1;10;510;Potato crisp (small bags)
114;1;10;510;Nuts (small bags)
113;1;119;510;Asti

 * 
 */

      const itemLines = fields.OrderData?.split("\n").map((line,index) => {
        const parts = line.split(";");
        const itemId = parts[0];
        const quantity = parts[1];
        const price = parts[2];
        const minuteFromMeetingStart = parts[3];
        const itemName = parts[4];
        const item = itemItems.find((p) => p.id === itemId) ?? {} as Item
        const lineItem : OrderItem = {
          id: index.toString(),
          price: item.price,
          item,
          quantity: quantity ? parseInt(quantity) : 0,
          deliveryHour: 0,
          deliveryMinute: minuteFromMeetingStart ? parseInt(minuteFromMeetingStart) : 0,
      
        
        } 
        return lineItem
      }).filter((p) => p.quantity > 0) ?? []

      //const room = rooms.find((p) => p.id === fields.RoomLookupId) ?? {} as Room
      const room = {} as Room

    const order: Order = {
      id: item.id,
      items: itemLines ?? [],
      deliverTo: room,
      deliveryDateTime: new Date(fields.Appointmentstart),
      organizer: fields.Organizer_x0020_Email,
      orderData: fields.OrderData ?? "",
    };
    return order;
  }) ?? [];

}