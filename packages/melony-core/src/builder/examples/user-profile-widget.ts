/**
 * User Profile Widget Example
 * Demonstrates form building and action handling
 */

import { z } from "zod";
import { defineWidget } from "../define-widget";
import { card, row, col, text, image, button, form, input, textarea } from "../helpers";

// Define the schema
export const userProfileSchema = z.object({
  type: z.literal("user-profile"),
  name: z.string().describe("User's full name"),
  email: z.string().email().describe("User's email address"),
  avatar: z.string().url().optional().describe("Avatar image URL"),
  bio: z.string().optional().describe("User biography"),
  role: z.string().optional().describe("User role or title"),
  editable: z.boolean().optional().describe("Whether the profile is editable"),
});

// Define the widget
export const UserProfileWidget = defineWidget({
  type: "user-profile",
  name: "User Profile",
  description: "Display and edit user profile information",
  schema: userProfileSchema,
  
  builder: (props) => {
    // If editable, show form
    if (props.editable) {
      return card(
        { title: "Edit Profile", size: "lg" },
        [
          form(
            { onSubmitAction: { type: "update-profile", payload: { email: props.email } } },
            [
              row(
                { gap: "md", align: "center" },
                [
                  ...(props.avatar
                    ? [image({ src: props.avatar, alt: props.name, size: "md" })]
                    : []
                  ),
                  col(
                    { gap: "sm", flex: 1 },
                    [
                      input({
                        label: "Name",
                        name: "name",
                        defaultValue: props.name,
                        placeholder: "Enter your name",
                        onChangeAction: { type: "field-changed", payload: { field: "name" } },
                      }),
                      input({
                        label: "Email",
                        name: "email",
                        inputType: "email",
                        defaultValue: props.email,
                        placeholder: "Enter your email",
                        onChangeAction: { type: "field-changed", payload: { field: "email" } },
                      }),
                    ]
                  ),
                ]
              ),
              
              input({
                label: "Role",
                name: "role",
                defaultValue: props.role || "",
                placeholder: "Your role or title",
              }),
              
              textarea({
                label: "Bio",
                name: "bio",
                rows: 4,
                defaultValue: props.bio || "",
                placeholder: "Tell us about yourself",
              }),
              
              row(
                { gap: "sm", justify: "end" },
                [
                  button({ label: "Cancel", variant: "secondary", onClickAction: { type: "cancel-edit" } }),
                  button({ label: "Save Changes", variant: "primary" }),
                ]
              ),
            ]
          ),
        ]
      );
    }
    
    // Otherwise, show read-only profile
    return card(
      { title: "User Profile" },
      [
        row(
          { gap: "md", align: "center" },
          [
            ...(props.avatar
              ? [image({ src: props.avatar, alt: props.name, size: "md" })]
              : []
            ),
            col(
              { gap: "xs", flex: 1 },
              [
                text({ value: props.name, size: "lg", weight: "bold" }),
                text({ value: props.email, color: "muted" }),
                ...(props.role
                  ? [text({ value: props.role, color: "primary", size: "sm" })]
                  : []
                ),
              ]
            ),
          ]
        ),
        
        ...(props.bio
          ? [text({ value: props.bio, color: "muted" })]
          : []
        ),
        
        button({
          label: "Edit Profile",
          variant: "outline",
          fullWidth: true,
          onClickAction: { type: "edit-profile", payload: { email: props.email } },
        }),
      ]
    );
  },
  
  examples: [
    {
      type: "user-profile",
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "https://i.pravatar.cc/150?img=1",
      bio: "Software engineer passionate about AI and web technologies.",
      role: "Senior Engineer",
      editable: false,
    },
    {
      type: "user-profile",
      name: "Bob Smith",
      email: "bob@example.com",
      role: "Product Manager",
      editable: true,
    },
  ],
});

