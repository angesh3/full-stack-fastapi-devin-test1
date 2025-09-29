import { expect, test } from "@playwright/test"
import { randomEmail, randomPassword } from "./utils/random.ts"

test("Admin page loads and displays users table", async ({ page }) => {
  await page.goto("/admin")

  await expect(page.getByRole("heading", { name: "Users Management" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Add User" })).toBeVisible()
  await expect(page.getByRole("columnheader", { name: "Full name" })).toBeVisible()
  await expect(page.getByRole("columnheader", { name: "Email" })).toBeVisible()
  await expect(page.getByRole("columnheader", { name: "Role" })).toBeVisible()
  await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible()
  await expect(page.getByRole("columnheader", { name: "Actions" })).toBeVisible()
})

test("Add a new user successfully", async ({ page }) => {
  const newUserEmail = randomEmail()
  const newUserPassword = randomPassword() + "Aa1!"

  await page.goto("/admin")

  await page.getByRole("button", { name: "Add User" }).click()

  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Add User" })).toBeVisible()

  await page.getByPlaceholder("Email").fill(newUserEmail)
  await page.getByPlaceholder("Full name").fill("Test User")
  await page.getByPlaceholder("Password").first().fill(newUserPassword)
  await page.getByPlaceholder("Password").last().fill(newUserPassword)

  await page.getByRole("button", { name: "Save" }).click()

  await expect(page.getByText("User created successfully.")).toBeVisible()
  await expect(page.getByRole("dialog")).not.toBeVisible()
  await expect(page.getByText(newUserEmail)).toBeVisible()
})

test("Add user with invalid email shows error", async ({ page }) => {
  await page.goto("/admin")

  await page.getByRole("button", { name: "Add User" }).click()

  await page.getByPlaceholder("Email").fill("invalid-email")
  await page.getByPlaceholder("Full name").fill("Test User")
  await page.getByPlaceholder("Password").first().fill("TestPass123!")
  await page.getByPlaceholder("Password").last().fill("TestPass123!")

  await page.getByPlaceholder("Email").blur()

  await expect(page.getByText("Invalid email address")).toBeVisible()
})

test("Add user with mismatched passwords shows error", async ({ page }) => {
  const newUserEmail = randomEmail()

  await page.goto("/admin")

  await page.getByRole("button", { name: "Add User" }).click()

  await page.getByPlaceholder("Email").fill(newUserEmail)
  await page.getByPlaceholder("Full name").fill("Test User")
  await page.getByPlaceholder("Password").first().fill("TestPass123!")
  await page.getByPlaceholder("Password").last().fill("DifferentPass123!")

  await page.getByPlaceholder("Password").last().blur()

  await expect(page.getByText("The passwords do not match")).toBeVisible()
})

test("Edit user functionality", async ({ page }) => {
  const newUserEmail = randomEmail()
  const newUserPassword = randomPassword() + "Aa1!"

  await page.goto("/admin")

  await page.getByRole("button", { name: "Add User" }).click()
  await page.getByPlaceholder("Email").fill(newUserEmail)
  await page.getByPlaceholder("Full name").fill("Original Name")
  await page.getByPlaceholder("Password").first().fill(newUserPassword)
  await page.getByPlaceholder("Password").last().fill(newUserPassword)
  await page.getByRole("button", { name: "Save" }).click()

  await expect(page.getByText("User created successfully.")).toBeVisible()
  await expect(page.getByRole("dialog")).not.toBeVisible()

  const userRow = page.getByRole("row").filter({ hasText: newUserEmail })
  await expect(userRow).toBeVisible()
  await userRow.getByRole("button", { name: "Actions" }).click()

  await page.getByRole("menuitem", { name: "Edit User" }).click()

  await expect(page.getByRole("dialog")).toBeVisible()

  await page.getByPlaceholder("Full name").clear()
  await page.getByPlaceholder("Full name").fill("Updated Name")
  await page.getByRole("button", { name: "Save" }).click()

  await expect(page.getByText("User updated successfully.")).toBeVisible()
  await expect(page.getByRole("dialog")).not.toBeVisible()
  await expect(page.getByText("Updated Name")).toBeVisible()
})

test("Delete user functionality", async ({ page }) => {
  const newUserEmail = randomEmail()
  const newUserPassword = randomPassword() + "Aa1!"

  await page.goto("/admin")

  await page.getByRole("button", { name: "Add User" }).click()
  await page.getByPlaceholder("Email").fill(newUserEmail)
  await page.getByPlaceholder("Full name").fill("User To Delete")
  await page.getByPlaceholder("Password").first().fill(newUserPassword)
  await page.getByPlaceholder("Password").last().fill(newUserPassword)
  await page.getByRole("button", { name: "Save" }).click()

  await expect(page.getByText("User created successfully.")).toBeVisible()
  await expect(page.getByRole("dialog")).not.toBeVisible()

  const userRow = page.getByRole("row").filter({ hasText: newUserEmail })
  await expect(userRow).toBeVisible()
  await userRow.getByRole("button", { name: "Actions" }).click()

  await page.getByRole("menuitem", { name: "Delete User" }).click()

  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByText("Are you sure you want to delete this user?")).toBeVisible()

  await page.getByRole("button", { name: "Delete" }).click()

  await expect(page.getByText("User deleted successfully")).toBeVisible()
  await expect(page.getByText(newUserEmail)).not.toBeVisible()
})

test("Cannot delete current logged-in user", async ({ page }) => {
  await page.goto("/admin")

  const currentUserRow = page.getByRole("row").filter({ hasText: "You" })
  const actionsButton = currentUserRow.getByRole("button")

  await expect(actionsButton).toBeDisabled()
})
