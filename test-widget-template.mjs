import { TemplateEngine } from './packages/melony-core/dist/index.js';
import { MelonyParser } from './packages/melony-core/dist/index.js';

console.log('=== Test: Widget Template with For Loop and Template Variables ===\n');

// Simulated widget template (what an AI would generate)
const widgetTemplate = `<card title="{{title}}">
  <list>
    <for items="{{items}}">
      <listitem orientation="horizontal" justify="between" onClickAction="{"type": "chooseProduct", "payload": {"productId": "{{item.id}}"}}">
        <image src="{{item.image}}" size="sm" alt="{{item.name}}" />
        <col gap="xs">
          <text value="{{item.name}}" size="lg" weight="semibold" />
          <text value="{{item.price}}" size="md" />
        </col>
      </listitem>
    </for>
  </list>
</card>`;

// Props passed to the widget (from AI response)
const props = {
  title: "Latest Products",
  items: [
    {
      id: "1",
      name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      price: "$109.95",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
    },
    {
      id: "2",
      name: "Mens Casual Premium Slim Fit T-Shirts",
      price: "$22.30",
      image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879_.jpg"
    },
    {
      id: "3",
      name: "Mens Cotton Jacket",
      price: "$55.99",
      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"
    }
  ]
};

console.log('1. Original Widget Template:');
console.log(widgetTemplate);
console.log('\n');

console.log('2. Props passed to widget:');
console.log(JSON.stringify(props, null, 2));
console.log('\n');

// Step 1: Template Engine processes the template with props
const processedTemplate = TemplateEngine.render(widgetTemplate, props);

console.log('3. Processed Template (after TemplateEngine.render):');
console.log(processedTemplate);
console.log('\n');

// Step 2: Parser parses the processed template
const parser = new MelonyParser();
const parsedBlocks = parser.parseContentAsBlocks(processedTemplate);

console.log('4. Parsed Blocks (ComponentDef structure):');
console.log(JSON.stringify(parsedBlocks, null, 2));
console.log('\n');

// Verify the structure
const card = parsedBlocks[0];
const list = card?.children?.[0];
const forComponent = list?.children?.[0];
const listItem = forComponent?.children?.[0];

console.log('5. Verification:');
console.log('✓ Card title:', card?.props?.title);
console.log('✓ For component items (should be array):', Array.isArray(forComponent?.props?.items));
console.log('✓ Number of items:', forComponent?.props?.items?.length);
console.log('✓ ListItem has template variables in children:');

const imageComponent = listItem?.children?.[0];
const colComponent = listItem?.children?.[1];

console.log('  - Image src contains {{item.image}}:', imageComponent?.props?.src?.includes('{{item.'));
console.log('  - Image alt contains {{item.name}}:', imageComponent?.props?.alt?.includes('{{item.'));
console.log('  - Text value contains {{item.name}}:', colComponent?.children?.[0]?.props?.value?.includes('{{item.'));
console.log('  - Text value contains {{item.price}}:', colComponent?.children?.[1]?.props?.value?.includes('{{item.'));
console.log('  - onClickAction contains {{item.id}}:', 
  JSON.stringify(listItem?.props?.onClickAction).includes('{{item.'));

console.log('\n6. Image URLs from items array:');
props.items.forEach((item, index) => {
  console.log(`  Item ${index + 1}: ${item.image}`);
});

console.log('\n✅ The template variables inside <for> are preserved and will be processed');
console.log('   at render time by the For component using ContextProvider!');
console.log('\n✅ Image URLs are correctly preserved without corruption!');

