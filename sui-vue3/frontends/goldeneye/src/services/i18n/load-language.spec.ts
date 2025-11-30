import { loadUserLanguage } from '@/services/i18n/load-language'

describe('load-language', () => {
  it('should resolve if language is available', async () => {
    const result = await loadUserLanguage({ email: 'test@user.com', type: 'staff', uuid: '111', language: 'it' })
    expect(result).toEqual('it')
  })

  it('should resolve default if language is not available', async () => {
    const result = await loadUserLanguage({ email: 'test@user.com', type: 'staff', uuid: '111' })
    expect(result).toEqual('en')
  })
})
