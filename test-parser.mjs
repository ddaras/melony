import { MelonyParser } from './packages/melony-core/dist/index.js';

console.log('=== Test 1: Single quotes in array with escaped quotes ===');
const testContent1 = `<widget type="product-list" title="Latest Products" items='[{"name": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops", "price": "$109.95", "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png"}, {"name": "Mens Casual Premium Slim Fit T-Shirts ", "price": "$22.30", "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png"}, {"name": "Mens Cotton Jacket", "price": "$55.99", "image": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png"}, {"name": "Mens Casual Slim Fit", "price": "$15.99", "image": "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png"}, {"name": "John Hardy Women\'s Legends Naga Gold & Silver Dragon Station Chain Bracelet", "price": "$695.00", "image": "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png"}]' />`;

console.log('Input:', testContent1);
console.log('\n');

const parser = new MelonyParser();
const result1 = parser.parseContentAsBlocks(testContent1);

console.log('Parsed result:');
console.log(JSON.stringify(result1, null, 2));

// Check if the items array was parsed correctly
if (result1.length > 0 && typeof result1[0] === 'object' && result1[0].props) {
  const items = result1[0].props.items;
  console.log('\nItems array:');
  console.log(JSON.stringify(items, null, 2));
  
  // Check if the problematic item with single quote was parsed correctly
  if (Array.isArray(items)) {
    const johnHardyItem = items.find(item => item.name && item.name.includes("John Hardy"));
    if (johnHardyItem) {
      console.log('\nJohn Hardy item (with single quote):');
      console.log(JSON.stringify(johnHardyItem, null, 2));
      console.log('\nName field:', johnHardyItem.name);
    }
  }
}

console.log('\n\n=== Test 2: JSON object with nested quotes in double-quoted attribute ===');
const testContent2 = `<card title="Latest Products">
  <list>
    <listitem orientation="horizontal" justify="between" onClickAction="{"type": "chooseProduct", "payload": {"productId": "123"}}">
      <image src="test.png" size="sm" alt="Test" />
      <col gap="xs">
        <text value="Product Name" size="lg" weight="semibold" />
        <text value="$99.99" size="md" />
      </col>
    </listitem>
  </list>
</card>`;

console.log('Input:', testContent2);
console.log('\n');

const result2 = parser.parseContentAsBlocks(testContent2);

console.log('Parsed result:');
console.log(JSON.stringify(result2, null, 2));

// Check if the onClickAction was parsed correctly as a JSON object
if (result2.length > 0 && typeof result2[0] === 'object') {
  console.log('\nLooking for onClickAction prop...');
  const findOnClickAction = (obj) => {
    if (obj.props && obj.props.onClickAction) {
      return obj.props.onClickAction;
    }
    if (obj.children) {
      for (const child of obj.children) {
        const found = findOnClickAction(child);
        if (found) return found;
      }
    }
    return null;
  };
  
  const onClickAction = findOnClickAction(result2[0]);
  if (onClickAction) {
    console.log('\nonClickAction parsed value:');
    console.log(JSON.stringify(onClickAction, null, 2));
    console.log('\nIs it an object?', typeof onClickAction === 'object');
    console.log('Has "type" property?', onClickAction.type === 'chooseProduct');
    console.log('Has nested "payload.productId"?', onClickAction.payload?.productId === '123');
  } else {
    console.log('\n⚠️  onClickAction not found or not parsed correctly');
  }
}
