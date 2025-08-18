import React from 'react';

const LanguageSelector = ({ currentLocale, onLocaleChange, availableLanguages = [] }) => {
  // 默认语言列表，作为后备选项，使用与API一致的key格式
  const defaultLanguages = [
    { code: 'en_US', label: 'English', iso_639_code: 'en' },
    { code: 'zh_CN', label: '中文', iso_639_code: 'zh' },
    { code: 'de_DE', label: 'Deutsch', iso_639_code: 'de' },
    { code: 'fr_FR', label: 'Français', iso_639_code: 'fr' },
    { code: 'es_ES', label: 'Español', iso_639_code: 'es' },
    { code: 'ja_JP', label: '日本語', iso_639_code: 'ja' },
    { code: 'ko_KR', label: '한국어', iso_639_code: 'ko' },
    { code: 'it_IT', label: 'Italiano', iso_639_code: 'it' },
    { code: 'pt_PT', label: 'Português', iso_639_code: 'pt' },
    { code: 'ru_RU', label: 'Русский', iso_639_code: 'ru' }
  ];

  // 使用从API获取的语言列表，如果没有则使用默认列表
  const languages = availableLanguages.length > 0 ? availableLanguages : defaultLanguages;

  console.log('🌐 LanguageSelector - 可用语言:', {
    availableLanguagesCount: availableLanguages.length,
    languages: languages.map(lang => ({ 
      code: lang.key || lang.code, 
      label: lang.label,
      iso_639_code: lang.iso_639_code 
    }))
  });

  return (
    <select 
      value={currentLocale || 'en_GB'}
      onChange={(e) => onLocaleChange(e.target.value)}
      style={{
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        backgroundColor: 'white',
        cursor: 'pointer'
      }}
    >
      {languages.map(lang => {
        // 使用key作为value以保持与API数据结构一致
        // API返回的数据结构: {key: "de_DE", label: "German", iso_639_code: "de"}
        // 默认数据结构: {code: "de", label: "Deutsch", iso_639_code: "de"}
        const langValue = lang.key || lang.code; // 使用key作为选择器的值
        const langKey = lang.key || lang.code;   // 用于React key属性
        const langLabel = lang.label;
        
        return (
          <option key={langKey} value={langValue}>
            {langLabel}
          </option>
        );
      })}
    </select>
  );
};

export default LanguageSelector;
