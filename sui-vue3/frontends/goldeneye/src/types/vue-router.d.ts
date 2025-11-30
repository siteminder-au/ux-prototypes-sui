import { EnterpriseCode, PartnerCode } from './opaque'

// wiki: https://siteminder.atlassian.net/wiki/spaces/EP/pages/2787312887/How+to+use+Opaque+type+to+input+parameters+safe
// we need to continue adding opaques for all possible param values
interface CustomRoute extends Route {
  params: {
    partnerCode: PartnerCode
    enterpriseCode: EnterpriseCode
    [key: string]: string
  }
}
