import { AxiosResponse, AxiosError } from "axios";

/**
 * @type FormType for the main state and the type of data for api
 */
type TableType = {
  _id?: string;
  tableName: string;
  owner?: string;
  isOwned: boolean;
  dimensions: { rows: number; cols: number };
  viewMode: "read" | "write";
  table: string[][];
};

type ResponseType = AxiosResponse<any, any> & { err: AxiosError };

/**
 * @type UserTable for object of the owned tables
 */
type UserTableType = {
  tableName: string;
  _id: string;
  viewMode: "read" | "write";
};

/**
 * @type SharedTable for object of the shared tables
 */
type SharedTableType = UserTableType & { owner: string };

/**
 * @type UserType
 */
type UserType = {
  username: string;
  _id: string;
};

export type {
  UserType,
  SharedTableType,
  UserTableType,
  ResponseType,
  TableType,
};
