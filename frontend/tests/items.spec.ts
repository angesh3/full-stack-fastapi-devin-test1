import { expect, test } from "@playwright/test"

test("Items page loads and displays heading", async ({ page }) => {
  await page.goto("/items")

  await expect(page.getByRole("heading", { name: "Items Management" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Add Item" })).toBeVisible()
})

test("Empty state is shown when no items exist", async ({ page }) => {
  await page.goto("/items")

  const emptyStateText = page.getByText("You don't have any items yet")
  if (await emptyStateText.isVisible()) {
    await expect(page.getByText("Add a new item to get started")).toBeVisible()
  }
})

test("Add a new item successfully", async ({ page }) => {
  await page.goto("/items")

  await page.getByRole("button", { name: "Add Item" }).click()

  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Add Item" })).toBeVisible()

  const itemTitle = `Test Item ${Date.now()}`
  const itemDescription = "This is a test item description"

  await page.getByPlaceholder("Title").fill(itemTitle)
  await page.getByPlaceholder("Description").fill(itemDescription)

  await page.getByRole("button", { name: "Save" }).click()

  await expect(page.getByText("Item created successfully.")).toBeVisible()
  await expect(page.getByText(itemTitle)).toBeVisible()
  await expect(page.getByText(itemDescription)).toBeVisible()
})

test("Add item without title shows validation error", async ({ page }) => {
  await page.goto("/items")

  await page.getByRole("button", { name: "Add Item" }).click()

  await page.getByPlaceholder("Description").fill("Description without title")
  await page.getByPlaceholder("Description").blur()

  const saveButton = page.getByRole("button", { name: "Save" })
  await expect(saveButton).toBeDisabled()
})

test("Items table displays correctly with data", async ({ page }) => {
  const itemTitle = `Table Test Item ${Date.now()}`

  await page.goto("/items")

  await page.getByRole("button", { name: "Add Item" }).click()
  await page.getByPlaceholder("Title").fill(itemTitle)
  await page.getByPlaceholder("Description").fill("Test description")
  await page.getByRole("button", { name: "Save" }).click()

  await expect(page.getByText("Item created successfully.")).toBeVisible()

  await expect(page.getByRole("columnheader", { name: "ID" })).toBeVisible()
  await expect(page.getByRole("columnheader", { name: "Title" })).toBeVisible()
  await expect(page.getByRole("columnheader", { name: "Description" })).toBeVisible()
  await expect(page.getByRole("columnheader", { name: "Actions" })).toBeVisible()

  await expect(page.getByText(itemTitle)).toBeVisible()
})

test("Edit item functionality", async ({ page }) => {
  const originalTitle = `Edit Test Item ${Date.now()}`
  const updatedTitle = `Updated Item ${Date.now()}`

  await page.goto("/items")

  await page.getByRole("button", { name: "Add Item" }).click()
  await page.getByPlaceholder("Title").fill(originalTitle)
  await page.getByPlaceholder("Description").fill("Original description")
  await page.getByRole("button", { name: "Save" }).click()

  await expect(page.getByText("Item created successfully.")).toBeVisible()

  const itemRow = page.getByRole("row").filter({ hasText: originalTitle })
  await itemRow.getByRole("button").click()

  await page.getByRole("menuitem", { name: "Edit Item" }).click()

  await expect(page.getByRole("dialog")).toBeVisible()

  await page.getByPlaceholder("Title").clear()
  await page.getByPlaceholder("Title").fill(updatedTitle)
  await page.getByPlaceholder("Description").clear()
  await page.getByPlaceholder("Description").fill("Updated description")
  await page.getByRole("button", { name: "Save" }).click()

  await expect(page.getByText("Item updated successfully.")).toBeVisible()
  await expect(page.getByText(updatedTitle)).toBeVisible()
  await expect(page.getByText("Updated description")).toBeVisible()
  await expect(page.getByText(originalTitle)).not.toBeVisible()
})

test("Delete item functionality", async ({ page }) => {
  const itemTitle = `Delete Test Item ${Date.now()}`

  await page.goto("/items")

  await page.getByRole("button", { name: "Add Item" }).click()
  await page.getByPlaceholder("Title").fill(itemTitle)
  await page.getByPlaceholder("Description").fill("Item to be deleted")
  await page.getByRole("button", { name: "Save" }).click()

  await expect(page.getByText("Item created successfully.")).toBeVisible()

  const itemRow = page.getByRole("row").filter({ hasText: itemTitle })
  await itemRow.getByRole("button").click()

  await page.getByRole("menuitem", { name: "Delete Item" }).click()

  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByText("Are you sure you want to delete this item?")).toBeVisible()

  await page.getByRole("button", { name: "Delete" }).click()

  await expect(page.getByText("Item deleted successfully")).toBeVisible()
  await expect(page.getByText(itemTitle)).not.toBeVisible()
})

test("Add item with only title (no description)", async ({ page }) => {
  const itemTitle = `No Description Item ${Date.now()}`

  await page.goto("/items")

  await page.getByRole("button", { name: "Add Item" }).click()
  await page.getByPlaceholder("Title").fill(itemTitle)

  await page.getByRole("button", { name: "Save" }).click()

  await expect(page.getByText("Item created successfully.")).toBeVisible()
  await expect(page.getByText(itemTitle)).toBeVisible()
  await expect(page.getByText("N/A")).toBeVisible()
})
