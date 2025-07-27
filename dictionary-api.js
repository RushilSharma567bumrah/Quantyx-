// Dictionary API integration for Quanty
// This uses the free Dictionary API (no key required)

// Get dictionary definition for a word or short phrase
async function getDictionaryDefinition(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`);
    
    if (!response.ok) {
      throw new Error(`Dictionary API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      return null;
    }
    
    // Format the dictionary response
    const entry = data[0];
    let result = `**${entry.word}**\n\n`;
    
    // Add phonetics if available
    if (entry.phonetics && entry.phonetics.length > 0) {
      const phonetic = entry.phonetics.find(p => p.text) || entry.phonetics[0];
      if (phonetic && phonetic.text) {
        result += `*${phonetic.text}*\n\n`;
      }
    }
    
    // Add meanings
    if (entry.meanings && entry.meanings.length > 0) {
      entry.meanings.forEach((meaning, i) => {
        if (i > 2) return; // Limit to 3 meanings
        
        result += `**${meaning.partOfSpeech}**\n`;
        
        if (meaning.definitions && meaning.definitions.length > 0) {
          meaning.definitions.slice(0, 2).forEach((def, j) => {
            result += `${j+1}. ${def.definition}\n`;
            if (def.example) {
              result += `   *Example: ${def.example}*\n`;
            }
          });
        }
        
        result += '\n';
      });
    }
    
    return result;
  } catch (error) {
    console.error('Dictionary API error:', error);
    return null;
  }
}

// Check if input is likely a dictionary query
function isDictionaryQuery(input) {
  const text = input.trim().toLowerCase();
  
  // Check if it's a single word or very short phrase (2-3 words)
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 3) return false;
  
  // Check for dictionary query patterns
  const dictionaryPatterns = [
    /^what (does|is) .+ mean$/,
    /^define .+$/,
    /^meaning of .+$/,
    /^definition of .+$/,
    /^synonym(s)? (for|of) .+$/
  ];
  
  return dictionaryPatterns.some(pattern => pattern.test(text)) || wordCount === 1;
}