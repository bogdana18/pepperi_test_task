// Get the root element and relevant child elements
const root = document.querySelector(".wrapper");
const newItem = root.querySelector(".item");
const itemsList = root.querySelector(".list");
// Create a Map to store the key-value pairs
const itemsMap = new Map([]);

// Function to clear the list
const clearList = () => {
  const result = confirm("Do you want to clear the list?");
  if (!result) {
    return;
  }
  itemsList.value = "";
  itemsMap.clear();
};

// Function to check if a string is valid
const isValid = (str) => {
  return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?@]/g.test(str);
};

// Function to add an item to the list
const addItem = () => {
  // Get the value from the input and split it into key-value parts
  const valueFromInput = newItem.value;
  const [firstPart, secondPart] = valueFromInput.split("=");

  // Check if the key and value are valid, and display an error message if not
  if (!firstPart || !secondPart || !isValid(firstPart) || !isValid(secondPart)) {
    itemsList.value = "Please enter a proper value";
    return;
  }

  // Add the key-value pair to the map and display the updated list
  itemsList.value = "";
  itemsMap.set(firstPart.trim(), secondPart.trim());
  showList();
  newItem.value = "";
};

// Function to convert the key-value pairs to XML and download the file
const showXml = () => {
  const input = document.querySelector('textarea').value.trim();
  const lines = input.split('\n');
  let xml = '<pairs>\n';
  lines.forEach((line) => {
    const [key, value] = line.split('=');
    xml += `<name>${key}</name>\n  <value>${value}</value>\n`;
  });
  xml += '</pairs>';
  
  // Create a Blob with the XML data
  const blob = new Blob([xml], { type: 'text/xml' });

  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'data.xml';
  
  // Trigger the download and cleanup
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to sort the key-value pairs
const sortBy = (compareFn) => {
  const sortedMap = new Map([...itemsMap.entries()].sort(compareFn));
  itemsMap.clear();
  sortedMap.forEach((value, key) => itemsMap.set(key, value));
  showList();
};

// Function to sort the list by value
const sortByValue = () => {
  sortBy(([keyA, valueA], [keyB, valueB]) => valueA.localeCompare(valueB));
};

// Function to sort the list by name
const sortByName = () => {
  sortBy(([keyA, valueA], [keyB, valueB]) => keyA.localeCompare(keyB));
};

// Function to display the list in the textarea
const showList = () => {
  itemsList.value = "";
  itemsMap.forEach((value, key) => {
    itemsList.value += `${key} = ${value}\n`;
  });
};

// Add event listeners to the relevant buttons
root.querySelector(".delete").addEventListener("click", clearList);
root.querySelector(".add").addEventListener("click", addItem);
root.querySelector(".show-xml").addEventListener("click", showXml);
root.querySelector(".sort-value").addEventListener("click", sortByValue);
root.querySelector(".sort-name").addEventListener("click", sortByName);

showList();
