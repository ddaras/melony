# Changelog

## [1.7.0] - Prefix-Based Component Rendering

### 🎉 Major Changes

#### Prefix System for Component Identification
- **Added `@melony:` prefix requirement** for rendering JSON as UI components
- JSON without the prefix is now displayed as plain text or markdown
- This provides explicit control over which JSON snippets are rendered as components

#### Removed Partial JSON Parsing
- **Removed `partial-json` dependency** to simplify the codebase
- **Only complete, valid JSON is now parsed** - no partial rendering
- More predictable behavior and easier debugging

### 📝 Breaking Changes

#### For AI Prompts
**Before:**
```typescript
system: `You are a helpful assistant. ${weatherUIPrompt}`
```

**After:**
```typescript
system: `You are a helpful assistant. ${weatherUIPrompt}

IMPORTANT: When rendering UI components, prefix the JSON with @melony:
Example: @melony:{"type": "weather-card", "location": "NYC", "temperature": 72, "condition": "Sunny"}

Regular JSON without the prefix will be displayed as text.`
```

#### For AI Output
**Before:**
```
The weather today is {"type": "weather-card", "temperature": 72}
```
This would automatically render as a component.

**After:**
```
The weather today is @melony:{"type": "weather-card", "temperature": 72, "location": "NYC", "condition": "Sunny"}
```
The `@melony:` prefix is required to render as a component.

### ✨ New Features

- **Exported `MELONY_PREFIX` constant** - Can be imported and used in your code
- **Better JSON handling** - Regular JSON in text won't accidentally render as components
- **Clearer intent** - Explicit prefix makes it obvious when JSON should be a component

### 🔧 What Stays the Same

#### Component Definitions
```typescript
// ✅ No changes needed
export const WeatherCard: React.FC<WeatherCardProps> = ({ 
  location, 
  temperature, 
  condition 
}) => (
  <Card>
    <h3>{location}</h3>
    <p>{temperature}°F - {condition}</p>
  </Card>
);
```

#### MelonyCard Usage
```typescript
// ✅ No changes needed
<MelonyCard
  text={streamingAIResponse}
  components={{
    "weather-card": WeatherCard,
  }}
/>
```

### 📦 Dependencies Changed

**Removed:**
- `partial-json@0.1.7`

**No new dependencies added** ✨

### 📚 Documentation Updates

- Updated README with prefix examples
- Added MIGRATION.md guide
- Added EXAMPLES.md with comprehensive examples
- Updated both app examples to use the new prefix system

### 🔍 Technical Details

#### New Text Parser Logic

The parser now:
1. Looks for `@melony:` prefix in the text
2. Attempts to parse complete JSON after the prefix
3. Validates that JSON has a `type` property (or is an array)
4. Only renders valid, complete JSON as components
5. Displays everything else as text/markdown

#### Files Changed

**Core Package (`packages/melony-core/`):**
- `src/text-parser.ts` - Rewrote to use prefix system, removed partial JSON
- `package.json` - Removed partial-json dependency
- `README.md` - Updated documentation
- `MIGRATION.md` - New migration guide
- `EXAMPLES.md` - New comprehensive examples

**Example Apps:**
- `apps/assistant-ui-x-melony/app/api/chat/route.ts` - Updated prompt
- `apps/generative-ui-template/lib/prompt-builder.ts` - Updated prompt builder

**Root:**
- `README.md` - Updated with prefix examples

### 🎯 Migration Checklist

For existing users:

- [ ] Update AI system prompts to include `@melony:` prefix instruction
- [ ] Test your AI to ensure it uses the prefix correctly
- [ ] Verify regular JSON displays as text (if desired)
- [ ] Run `pnpm install` to update dependencies
- [ ] Build and test your application

### 💡 Benefits

1. **More Control**: You explicitly decide which JSON is a component
2. **No False Positives**: Regular JSON won't accidentally render as components
3. **Simpler Code**: Removed external parsing dependency
4. **Easier Debugging**: Clear visual indicator of what will render
5. **Better Performance**: Native JSON.parse is faster than partial parsing
6. **More Predictable**: Complete JSON only, no guessing about partial states

### 🐛 Bug Fixes

- Fixed issue where any JSON with a `type` property would render as a component
- Fixed potential issues with malformed JSON causing render errors
- Improved string escaping and bracket matching in JSON parsing

### 🔮 Future Considerations

- The prefix can be customized by forking and changing `MELONY_PREFIX` constant
- Considering making the prefix configurable via props in future versions

### 📖 Examples

See `EXAMPLES.md` for comprehensive usage examples, including:
- Basic component rendering
- Multiple components
- Mixed content (text + components)
- Integration with AI SDK
- Testing strategies

See `MIGRATION.md` for detailed migration instructions.

---

## Previous Versions

See git history for changes in previous versions.

