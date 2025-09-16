import i18n from '../i18n';

describe('i18n', () => {
  it('deve estar configurado corretamente', () => {
    expect(i18n).toBeDefined();
    expect(i18n.language).toBe('pt');
  });

  it('deve ter as traduções em português', () => {
    const homeTitle = i18n.t('home:title');
    expect(homeTitle).toBe('Nexus Válvulas E Conexões Industriais');
  });

  it('deve ter as traduções em inglês', () => {
    i18n.changeLanguage('en');
    const homeTitle = i18n.t('home:title');
    expect(homeTitle).toBe('Nexus Industrial Valves and Fittings');
  });

  it('deve alternar entre idiomas corretamente', () => {
    i18n.changeLanguage('pt');
    let homeTitle = i18n.t('home:title');
    expect(homeTitle).toBe('Nexus Válvulas E Conexões Industriais');

    i18n.changeLanguage('en');
    homeTitle = i18n.t('home:title');
    expect(homeTitle).toBe('Nexus Industrial Valves and Fittings');
  });
});