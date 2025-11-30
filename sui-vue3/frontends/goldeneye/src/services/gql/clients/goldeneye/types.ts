/* eslint-disable */
/* Generate this file by running `npm run graphql-codegen:goldeneye` */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Accommodation = {
  __typename?: 'Accommodation';
  code: Scalars['ID']['output'];
  label: Scalars['String']['output'];
};

export type Camp = {
  __typename?: 'Camp';
  accommodations: Array<Maybe<Accommodation>>;
  campsites: Array<Maybe<Campsite>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Campsite = {
  __typename?: 'Campsite';
  accommodations: Array<Maybe<Scalars['String']['output']>>;
  allowPets: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dynamicDiscounts: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  maximumAdvanceBookingDays: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  restrictToMobile: Scalars['Boolean']['output'];
  smokingPolicy: Scalars['String']['output'];
  thumbnailImageSrc?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  camp: Camp;
};


export type QueryCampArgs = {
  id: Scalars['ID']['input'];
};

export type GetCampQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCampQuery = { __typename?: 'Query', camp: { __typename?: 'Camp', name: string, campsites: Array<{ __typename?: 'Campsite', id: string, name: string, description?: string | null, accommodations: Array<string | null>, maximumAdvanceBookingDays: boolean, dynamicDiscounts: boolean, restrictToMobile: boolean, smokingPolicy: string, allowPets: boolean, thumbnailImageSrc?: string | null } | null>, accommodations: Array<{ __typename?: 'Accommodation', code: string, label: string } | null> } };
