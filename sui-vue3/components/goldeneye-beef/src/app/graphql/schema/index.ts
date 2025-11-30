/* eslint-disable */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>
}

import { GraphQLResolveInfo } from 'graphql';
import { Context } from './context';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type GqlAccommodation = {
  __typename?: 'Accommodation';
  code: Scalars['ID']['output'];
  label: Scalars['String']['output'];
};

export type GqlCamp = {
  __typename?: 'Camp';
  accommodations: Array<Maybe<GqlAccommodation>>;
  campsites: Array<Maybe<GqlCampsite>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type GqlCampsite = {
  __typename?: 'Campsite';
  accommodations: Array<Maybe<Scalars['String']['output']>>;
  allowPets: Scalars['Boolean']['output'];
  description: Maybe<Scalars['String']['output']>;
  dynamicDiscounts: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  maximumAdvanceBookingDays: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  restrictToMobile: Scalars['Boolean']['output'];
  smokingPolicy: Scalars['String']['output'];
  thumbnailImageSrc: Maybe<Scalars['String']['output']>;
};

export type GqlQuery = {
  __typename?: 'Query';
  camp: GqlCamp;
};


export type GqlQueryCampArgs = {
  id: Scalars['ID']['input'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type GqlResolversTypes = {
  Accommodation: ResolverTypeWrapper<DeepPartial<GqlAccommodation>>;
  Boolean: ResolverTypeWrapper<DeepPartial<Scalars['Boolean']['output']>>;
  Camp: ResolverTypeWrapper<DeepPartial<GqlCamp>>;
  Campsite: ResolverTypeWrapper<DeepPartial<GqlCampsite>>;
  ID: ResolverTypeWrapper<DeepPartial<Scalars['ID']['output']>>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<DeepPartial<Scalars['String']['output']>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type GqlResolversParentTypes = {
  Accommodation: DeepPartial<GqlAccommodation>;
  Boolean: DeepPartial<Scalars['Boolean']['output']>;
  Camp: DeepPartial<GqlCamp>;
  Campsite: DeepPartial<GqlCampsite>;
  ID: DeepPartial<Scalars['ID']['output']>;
  Query: {};
  String: DeepPartial<Scalars['String']['output']>;
};

export type GqlAccommodationResolvers<ContextType = Context, ParentType extends GqlResolversParentTypes['Accommodation'] = GqlResolversParentTypes['Accommodation']> = {
  code: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  label: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlCampResolvers<ContextType = Context, ParentType extends GqlResolversParentTypes['Camp'] = GqlResolversParentTypes['Camp']> = {
  accommodations: Resolver<Array<Maybe<GqlResolversTypes['Accommodation']>>, ParentType, ContextType>;
  campsites: Resolver<Array<Maybe<GqlResolversTypes['Campsite']>>, ParentType, ContextType>;
  id: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlCampsiteResolvers<ContextType = Context, ParentType extends GqlResolversParentTypes['Campsite'] = GqlResolversParentTypes['Campsite']> = {
  accommodations: Resolver<Array<Maybe<GqlResolversTypes['String']>>, ParentType, ContextType>;
  allowPets: Resolver<GqlResolversTypes['Boolean'], ParentType, ContextType>;
  description: Resolver<Maybe<GqlResolversTypes['String']>, ParentType, ContextType>;
  dynamicDiscounts: Resolver<GqlResolversTypes['Boolean'], ParentType, ContextType>;
  id: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  maximumAdvanceBookingDays: Resolver<GqlResolversTypes['Boolean'], ParentType, ContextType>;
  name: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  restrictToMobile: Resolver<GqlResolversTypes['Boolean'], ParentType, ContextType>;
  smokingPolicy: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  thumbnailImageSrc: Resolver<Maybe<GqlResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlQueryResolvers<ContextType = Context, ParentType extends GqlResolversParentTypes['Query'] = GqlResolversParentTypes['Query']> = {
  camp: Resolver<GqlResolversTypes['Camp'], ParentType, ContextType, RequireFields<GqlQueryCampArgs, 'id'>>;
};

export type GqlResolvers<ContextType = Context> = {
  Accommodation: GqlAccommodationResolvers<ContextType>;
  Camp: GqlCampResolvers<ContextType>;
  Campsite: GqlCampsiteResolvers<ContextType>;
  Query: GqlQueryResolvers<ContextType>;
};

