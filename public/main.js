import { loadProducts, saveProducts } from "./storage.js";
/*
 * 1. wyświetlanie produktów,
 * 2. wyszukiwanie po kodzie, nazwie i kategorii,
 * 3. dodawanie produktu,
 * 4. edycja produktu,
 * 5. usuwanie produktu po potwierdzeniu,
 * 6. podsumowanie liczby produktów, sztuk i pozycji z niskim stanem,
 * 7. zapisywanie danych w localStorage.
 *
 * Poza: logowanie, role użytkowników, serwer, baza SQL,
 * zamówienia, faktury, dostawy i obsługa wielu magazynów.
 */
let products = loadProducts();
let editingProductId = null;
const tableBody = getElement("products-table-body");
const searchInput = getElement("search-input");
const addButton = getElement("add-product-button");
const formSection = getElement("product-form-section");
const productForm = getElement("product-form");
const formTitle = getElement("form-title");
const formError = getElement("form-error");
const cancelButton = getElement("cancel-form-button");
const emptyState = getElement("empty-state");
const idInput = getElement("product-id");
const codeInput = getElement("product-code");
const nameInput = getElement("product-name");
const categoryInput = getElement("product-category");
const priceInput = getElement("product-price");
const quantityInput = getElement("product-quantity");
const minimumInput = getElement("product-minimum");
function getElement(id) {
    const element = document.getElementById(id);
    if (element === null) {
        throw new Error(`Nie znaleziono elementu HTML o id="${id}".`);
    }
    return element;
}
function formatPrice(price) {
    return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN"
    }).format(price);
}
function hasLowStock(product) {
    return product.quantity <= product.minimumStock;
}
function renderProducts() {
    const query = searchInput.value.trim().toLocaleLowerCase("pl-PL");
    const filteredProducts = products.filter((product) => {
        const searchableText = `${product.code} ${product.name} ${product.category}`
            .toLocaleLowerCase("pl-PL");
        return searchableText.includes(query);
    });
    tableBody.replaceChildren();
    for (const product of filteredProducts) {
        const row = document.createElement("tr");
        appendCell(row, product.code);
        appendProductNameCell(row, product.name);
        appendCell(row, product.category);
        appendCell(row, formatPrice(product.price));
        appendCell(row, String(product.quantity));
        appendCell(row, String(product.minimumStock));
        const statusCell = document.createElement("td");
        const status = document.createElement("span");
        status.className = hasLowStock(product) ? "status status-low" : "status status-ok";
        status.textContent = hasLowStock(product) ? "Niski stan" : "Dostępny";
        statusCell.append(status);
        row.append(statusCell);
        const actionsCell = document.createElement("td");
        const actions = document.createElement("div");
        actions.className = "actions";
        const editButton = createActionButton("Edytuj", "button button-secondary button-small");
        editButton.addEventListener("click", () => openEditForm(product.id));
        const deleteButton = createActionButton("Usuń", "button button-danger button-small");
        deleteButton.addEventListener("click", () => deleteProduct(product.id));
        actions.append(editButton, deleteButton);
        actionsCell.append(actions);
        row.append(actionsCell);
        tableBody.append(row);
    }
    emptyState.hidden = filteredProducts.length !== 0;
    renderStatistics();
}
function appendCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.append(cell);
}
function appendProductNameCell(row, name) {
    const cell = document.createElement("td");
    const strong = document.createElement("span");
    strong.className = "product-name";
    strong.textContent = name;
    cell.append(strong);
    row.append(cell);
}
function createActionButton(label, className) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    return button;
}
function renderStatistics() {
    getElement("stat-products").textContent = String(products.length);
    const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
    getElement("stat-quantity").textContent = String(totalQuantity);
    const lowStockCount = products.filter(hasLowStock).length;
    getElement("stat-low-stock").textContent = String(lowStockCount);
}
function openAddForm() {
    editingProductId = null;
    productForm.reset();
    idInput.value = "";
    formTitle.textContent = "Dodaj produkt";
    hideFormError();
    formSection.hidden = false;
    codeInput.focus();
}
function openEditForm(productId) {
    const product = products.find((item) => item.id === productId);
    if (product === undefined) {
        return;
    }
    editingProductId = product.id;
    idInput.value = product.id;
    codeInput.value = product.code;
    nameInput.value = product.name;
    categoryInput.value = product.category;
    priceInput.value = String(product.price);
    quantityInput.value = String(product.quantity);
    minimumInput.value = String(product.minimumStock);
    formTitle.textContent = "Edytuj produkt";
    hideFormError();
    formSection.hidden = false;
    codeInput.focus();
}
function closeForm() {
    formSection.hidden = true;
    productForm.reset();
    editingProductId = null;
    hideFormError();
}
function showFormError(message) {
    formError.textContent = message;
    formError.hidden = false;
}
function hideFormError() {
    formError.textContent = "";
    formError.hidden = true;
}
function readProductForm() {
    const code = codeInput.value.trim();
    const name = nameInput.value.trim();
    const category = categoryInput.value.trim();
    const price = Number(priceInput.value);
    const quantity = Number(quantityInput.value);
    const minimumStock = Number(minimumInput.value);
    if (!code || !name || !category) {
        showFormError("Kod, nazwa i kategoria nie mogą być puste.");
        return null;
    }
    if (!Number.isFinite(price) || price < 0 ||
        !Number.isInteger(quantity) || quantity < 0 ||
        !Number.isInteger(minimumStock) || minimumStock < 0) {
        showFormError("Cena musi być nieujemną liczbą, a stany nieujemnymi liczbami całkowitymi.");
        return null;
    }
    const duplicateCode = products.some((product) => product.code.toLocaleLowerCase("pl-PL") === code.toLocaleLowerCase("pl-PL") &&
        product.id !== editingProductId);
    if (duplicateCode) {
        showFormError("Produkt o takim kodzie już istnieje. Podaj unikalny kod.");
        return null;
    }
    return { code, name, category, price, quantity, minimumStock };
}
function handleFormSubmit(event) {
    event.preventDefault();
    const productInput = readProductForm();
    if (productInput === null) {
        return;
    }
    if (editingProductId === null) {
        const newProduct = {
            id: crypto.randomUUID(),
            ...productInput
        };
        products.push(newProduct);
    }
    else {
        products = products.map((product) => product.id === editingProductId
            ? { id: product.id, ...productInput }
            : product);
    }
    saveProducts(products);
    closeForm();
    renderProducts();
}
function deleteProduct(productId) {
    const product = products.find((item) => item.id === productId);
    if (product === undefined) {
        return;
    }
    const confirmed = window.confirm(`Czy na pewno usunąć produkt „${product.name}”?`);
    if (!confirmed) {
        return;
    }
    products = products.filter((item) => item.id !== productId);
    saveProducts(products);
    renderProducts();
}
// Rejestrujemy zdarzenia interfejsu.
addButton.addEventListener("click", openAddForm);
cancelButton.addEventListener("click", closeForm);
productForm.addEventListener("submit", handleFormSubmit);
searchInput.addEventListener("input", renderProducts);
// Pierwsze renderowanie po uruchomieniu modułu.
renderProducts();
