const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

class ConverterService {
  // Maps the content of a text document to a structured JSON format
  mapContentToJson(text) {
    const sections = {};
    let currentSection = null;
    let currentSubSection = null;

    // Split the text into lines and filter out empty lines
    const lines = text.split('\n').filter(line => line.trim());

    lines.forEach(line => {
      line = line.trim();

      // Handle main sections (with colon)
      if (line.includes(':') && !line.startsWith('-') && !line.startsWith('*')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();

        // Clean the key name
        const cleanKey = this.cleanKeyName(key);

        if (value) {
          // If it has a value, it's a direct key-value pair
          sections[cleanKey] = value;
        } else {
          // If no value, it's a section header
          currentSection = cleanKey;
          sections[currentSection] = {};
        }
        return;
      }

      // Handle bullet points and lists
      if (line.startsWith('-') || line.startsWith('*')) {
        if (currentSection) {
          if (!Array.isArray(sections[currentSection])) {
            sections[currentSection] = [];
          }
          sections[currentSection].push(line.substring(1).trim());
        }
        return;
      }

      // For numbered lists, map to array of objects
      if (/^\d+\./.test(line)) {
        const [number, ...content] = line.split('.');
        const sectionContent = content.join('.').trim();

        if (currentSection) {
          if (!Array.isArray(sections[currentSection])) {
            sections[currentSection] = [];
          }
          sections[currentSection].push({
            number: parseInt(number),
            content: sectionContent
          });
        }
        return;
      }

      // For bulleted lists (- or *), map to array of strings
      if (line.startsWith('-') || line.startsWith('*')) {
        if (currentSection) {
          if (!Array.isArray(sections[currentSection])) {
            sections[currentSection] = [];
          }
          sections[currentSection].push(line.substring(1).trim());
        }
        return;
      }

      // Handle sub-sections (indented content)
      if (line.startsWith('  ') || line.startsWith('\t')) {
        if (currentSection && sections[currentSection]) {
          if (typeof sections[currentSection] !== 'object') {
            sections[currentSection] = { details: sections[currentSection] };
          }
          if (!sections[currentSection].subItems) {
            sections[currentSection].subItems = [];
          }
          sections[currentSection].subItems.push(line.trim());
        }
        return;
      }

      // Handle regular content within sections
      if (currentSection && line) {
        if (typeof sections[currentSection] === 'object') {
          if (!sections[currentSection].content) {
            sections[currentSection].content = [];
          }
          sections[currentSection].content.push(line);
        }
      }
    });

    return sections; // Return the structured sections
  }

  // Cleans the key name by trimming, lowering case, and removing special characters
  cleanKeyName(key) {
    return key.trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+(.)/g, (match, group) => group.toUpperCase());
  }

  // Converts a document to a structured JSON format
  async convertDocument(file) {
    let content;
    let structuredData;

    try {
      // Read content based on the file type
      if (file.mimetype === 'text/plain') {
        content = fs.readFileSync(file.path, 'utf8');
      } else {
        const result = await mammoth.extractRawText({
          path: file.path
        });
        content = result.value;
      }

      // Map the content to JSON structure
      structuredData = this.mapContentToJson(content);

      // Prepare the JSON result with metadata
      const jsonResult = {
        fileName: file.originalname,
        data: structuredData,
        metadata: {
          convertedAt: new Date().toISOString(),
          fileSize: file.size,
          mimeType: file.mimetype,
          processingStatus: 'success'
        }
      };

      // Save JSON to temp directory
      const jsonFileName = `${path.parse(file.originalname).name}_${Date.now()}.json`;
      const jsonPath = path.join('temp', jsonFileName);
      fs.writeFileSync(jsonPath, JSON.stringify(jsonResult, null, 2));

      return {
        ...jsonResult,
        jsonPath: jsonPath // Return the path to the saved JSON file
      };
    } catch (error) {
      throw new Error(`Document conversion failed: ${error.message}`); // Handle errors during conversion
    }
  }
}
module.exports = new ConverterService();