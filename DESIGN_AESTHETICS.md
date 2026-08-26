# DESIGN-AESTHETICS.md

# CPSU Planning and Development Office Information Hub

## Design Aesthetics, Visual Identity, UI Direction, and Experience Guidelines

---

# 1. Purpose of This Document

This document defines the visual language, interface personality, layout principles, interaction behavior, and aesthetic rules for the **CPSU Planning and Development Office Information Hub**.

The purpose of this guide is to prevent the project from becoming visually generic.

The interface must not look like:

```text
A generic AI-generated dashboard
A startup SaaS template
A cryptocurrency dashboard
A generic admin panel
A shadcn/ui demo
A copied government portal
A generic university website theme
A glassmorphism portfolio
A dashboard filled with unnecessary cards
```

The system should instead have a recognizable identity based on:

```text
CPSU
Planning
Institutional information
Records
Documentation
Academic administration
Structured data
Public transparency
Long-term usability
```

The visual design should feel intentionally designed for the **CPSU Planning and Development Office**, not merely recolored from an existing template.

---

# 2. Core Visual Identity

The fundamental visual character of the website is:

> **Institutional clarity with structured CPSU identity.**

The interface should feel:

```text
Professional
Academic
Institutional
Organized
Quiet
Structured
Reliable
Modern
Purposeful
Accessible
Information-focused
```

It should not feel:

```text
Trendy for the sake of being trendy
Experimental
Corporate startup-like
Overly playful
Overly futuristic
Luxury-oriented
Gaming-inspired
Social-media inspired
Artificially "AI-looking"
```

The website should communicate that it is a dependable information repository maintained by a university office.

---

# 3. Visual Concept

The main visual concept is:

# **The Institutional Archive**

Rather than designing the website like a SaaS dashboard, the website should take visual inspiration from:

```text
University records
Institutional reports
Planning documents
Research publications
Library catalog systems
Administrative filing systems
Academic annual reports
Physical document folders
Formal university correspondence
```

These references should influence the layout subtly.

The interface should therefore emphasize:

```text
Clear hierarchy
Dividers
Labels
Section numbering
Structured columns
Categorization
Document-oriented layouts
Readable metadata
Calm spacing
Predictable navigation
```

The design should feel like a digital institutional archive rather than an application trying to impress users with interface effects.

---

# 4. CPSU Green as the Primary Identity

Green is the dominant visual identity of the system.

Green should represent:

```text
CPSU institutional identity
Growth
Development
Planning
Stability
Continuity
Academic progress
```

However, the website must not become overwhelmingly green.

The green should be used strategically.

The interface should primarily consist of:

```text
Warm or neutral white surfaces
Soft neutral backgrounds
Dark readable typography
CPSU-inspired green accents
Subtle borders
Muted supporting colors
```

The result should feel institutional and refined.

---

# 5. Recommended Core Color Direction

Until official CPSU digital brand values are formally supplied, colors should remain configurable.

Do not claim these values are official CPSU brand colors.

They are the project's working digital palette.

---

## 5.1 Primary Green

Recommended visual direction:

```text
Deep academic green
Forest green
Institutional green
```

Suggested working value:

```text
#14532D
```

Approximate Tailwind equivalent:

```text
green-900
```

Primary green should be used for:

```text
Main navigation emphasis
Primary buttons
Active navigation states
Section markers
Important headings
Admin identity
Key interactive controls
Selected filters
Important iconography
```

---

# 6. Secondary Green

Use a slightly lighter green for interactive and supporting elements.

Suggested direction:

```text
#166534
```

or approximately:

```text
green-800
```

Possible usage:

```text
Hover states
Secondary navigation highlights
Section titles
Small visual markers
Icon backgrounds
Active breadcrumbs
```

---

# 7. Supporting Green

Use a medium green sparingly.

Suggested direction:

```text
#15803D
```

approximately:

```text
green-700
```

Use for:

```text
Successful actions
Focused controls
Small badges
Progress indicators
Links where appropriate
```

Do not use this green for large backgrounds throughout the website.

---

# 8. Pale Green Surface

A very subtle green tint may be used as a contextual surface.

Suggested direction:

```text
#F0FDF4
```

or slightly more muted.

Use for:

```text
Selected repository categories
Success states
Important information boxes
Active filter sections
Subtle institutional highlights
```

Avoid creating large bright green blocks.

---

# 9. Neutral Background Palette

The application should not use pure white everywhere.

Main canvas:

```text
#F7F8F6
```

or similar slightly warm neutral.

Primary surfaces:

```text
#FFFFFF
```

Secondary surfaces:

```text
#F3F5F2
```

Borders:

```text
#DDE2DC
```

Strong borders:

```text
#C9D1CA
```

This creates a slightly editorial, document-oriented appearance.

---

# 10. Dark Colors

Primary text should use a near-black neutral rather than absolute black.

Recommended:

```text
#17201A
```

Secondary text:

```text
#4B574F
```

Muted text:

```text
#6F7972
```

This creates better harmony with the green identity than using cold blue-gray text everywhere.

---

# 11. Accent Color Philosophy

Avoid adding many unrelated colors.

The interface should primarily rely on:

```text
Green
Neutral white
Soft gray
Dark charcoal
```

Additional colors should only communicate semantic meaning.

Examples:

```text
Red → destructive/error
Amber → warning
Blue → informational when green would create ambiguity
```

Do not use decorative rainbow palettes.

---

# 12. Color Distribution

Approximate visual balance:

```text
70% neutral surfaces

20% dark text, borders, and structure

10% CPSU green and semantic accents
```

Green should feel significant because it appears in strategically important areas rather than because everything is painted green.

---

# 13. Avoid the Typical AI Color Treatment

Do not use:

```text
Green-to-blue gradients
Purple gradients
Neon green
Glowing buttons
Gradient text
Blurred gradient spheres
Green glass panels
Animated aurora backgrounds
Gradient borders around cards
```

These visual effects are common in generic AI-generated interfaces and conflict with the institutional purpose of the site.

---

# 14. Typography Philosophy

Typography should resemble a modern institutional publication.

The system should feel closer to:

```text
Annual reports
University publications
Formal institutional websites
Academic documentation
Library catalogs
```

than to:

```text
Marketing landing pages
Technology startups
Gaming dashboards
Creative portfolios
```

---

# 15. Typography Structure

Use a clear typographic hierarchy.

Recommended hierarchy:

```text
Page title
Section heading
Subsection heading
Resource title
Metadata label
Body text
Supporting text
Caption
```

Typography should communicate hierarchy even without colored cards.

---

# 16. Heading Character

Main headings should feel authoritative but restrained.

Avoid giant marketing headings such as:

```text
font-size: 72px
```

for normal repository pages.

Typical desktop page title:

```text
32–42px
```

Typical major section heading:

```text
24–30px
```

Typical subsection:

```text
18–22px
```

Repository file titles:

```text
15–18px
```

---

# 17. Font Weight

Avoid excessive bold text.

Suggested hierarchy:

```text
Page title → 650–700
Section title → 600–650
Resource title → 550–600
Body → 400
Metadata → 400–500
Labels → 500–600
```

Large sections should gain hierarchy through spacing and scale, not only through font weight.

---

# 18. Serif Usage

A restrained serif typeface may optionally be used for:

```text
Major institutional headings
Office name
Special editorial sections
About page headings
Formal introductory text
```

The rest of the interface should remain sans-serif.

If implemented carefully, this can distinguish the site from generic software dashboards.

Possible direction:

```text
Formal serif heading
+
Clean sans-serif interface
```

However, serif typography should be used sparingly.

---

# 19. Page Layout Philosophy

Pages should not consist of endless floating cards.

Instead, use:

```text
Structured sections
Visible boundaries
Document-style groupings
Columns
Rows
Lists
Tables
Section headers
Subtle separators
```

Whitespace should create structure.

---

# 20. Maximum Content Width

Main content should remain comfortably readable.

Suggested maximum:

```text
1280px–1440px
```

Documentation-oriented areas may use:

```text
1100px–1280px
```

Long textual content should use narrower readable columns.

Avoid stretching paragraph text across ultrawide displays.

---

# 21. Global Website Structure

Desktop layout should generally follow:

```text
┌─────────────────────────────────────────────────────────────┐
│ CPSU Institutional Header                                   │
├─────────────────────────────────────────────────────────────┤
│ Primary Navigation                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Page context / breadcrumb                                   │
│                                                             │
│ Page title                                                  │
│ Page description                                            │
│                                                             │
│ Main information area                                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Institutional Footer                                        │
└─────────────────────────────────────────────────────────────┘
```

The site does not need a permanently floating sidebar for the public interface.

---

# 22. Institutional Header

The public header should immediately establish university identity.

Possible composition:

```text
CPSU seal/logo
Central Philippines State University
Planning and Development Office
Information Hub
```

The branding should be more prominent than application-style branding.

Avoid treating the site name like a startup product logo.

---

# 23. Header Visual Style

The primary header can use deep CPSU green.

Example:

```text
Deep green background
White institutional typography
CPSU seal on left
Office identity beside seal
Minimal utility controls on right
```

The header should feel official rather than decorative.

---

# 24. Two-Level Header Concept

A distinctive institutional structure may use two levels.

Example:

```text
┌──────────────────────────────────────────────────────┐
│ CENTRAL PHILIPPINES STATE UNIVERSITY                 │
│ Planning and Development Office                      │
├──────────────────────────────────────────────────────┤
│ Home   Repository   Statistics   Performance   About │
└──────────────────────────────────────────────────────┘
```

The upper strip provides institutional identity.

The lower strip provides application navigation.

This gives the site a more authentic university-system character.

---

# 25. Navigation

Navigation should be calm and predictable.

Do not make every navigation item look like a button.

Default navigation should appear as:

```text
Text
+
subtle hover
+
active underline or marker
```

Active navigation may use:

```text
Green underline
Thin left marker
Stronger font weight
```

Avoid placing every menu item inside rounded pills.

---

# 26. Section Index Identity

One distinctive design element should be the use of **section codes**.

Examples:

```text
A
A.1
A.2
A.3
A.4

B
B.1
B.2
B.3
```

These codes come directly from the repository's institutional organization.

They can become part of the visual identity.

Example:

```text
A.1
Student Population
```

rather than merely:

```text
Student Population
```

This makes the design specific to the Planning and Development Office.

---

# 27. Section Marker Design

Section markers may use:

```text
Small green rectangular marker
Thin green left rail
Outlined square label
Compact code block
```

Example:

```text
┌──────┐
│ A.1  │  Student Population
└──────┘
```

Avoid circular icon bubbles for every section.

Rectangular institutional labeling better matches reports and document systems.

---

# 28. Page Title Treatment

Instead of a generic giant hero banner, repository pages should use an editorial header.

Example:

```text
STATISTICAL PROFILE
A.1 Student Population

Institutional student population reports and supporting
records for the most recent reporting periods.
```

Include a small category code or eyebrow text.

This creates an archival and report-inspired appearance.

---

# 29. Home Page Philosophy

The home page should not resemble a startup landing page.

Avoid:

```text
Huge gradient headline
"Transform your workflow"
Floating illustration
Three generic feature cards
Testimonials
Pricing-style sections
```

The home page should introduce:

```text
The office
The repository
Its institutional purpose
Its major information sections
Recent resources
Important navigation points
```

---

# 30. Home Page Visual Direction

Recommended composition:

```text
Institutional introduction
↓
Major information sections
↓
Repository highlights
↓
Recently published resources
↓
Office information
```

The page should feel like the digital front desk of the Planning and Development Office.

---

# 31. Home Hero

The home hero should be restrained.

Possible layout:

```text
Left:
CPSU Planning and Development Office
Information Hub

Institutional description

[Browse Repository]

Right:
A structured institutional visual,
campus image,
planning document composition,
or subtle data/document motif
```

Do not use generic laptop mockups.

Do not use abstract 3D AI artwork.

---

# 32. Hero Typography

Suggested:

```text
PLANNING AND DEVELOPMENT OFFICE

Information Hub
```

The university/office name should carry more authority than a marketing tagline.

Avoid meaningless slogans unless officially supplied.

---

# 33. Signature Home Visual Element

Instead of a generic hero illustration, create a structured visual inspired by physical archive folders.

Example:

```text
STATISTICAL PROFILE
2024—2026

HIGHER EDUCATION
PERFORMANCE

RESEARCH &
EXTENSION

FINANCIAL
PERFORMANCE
```

These could appear as overlapping document-like panels or vertical index tabs.

The design should remain flat and editorial, not 3D-heavy.

---

# 34. Repository Page

The repository is the most important functional interface.

Its design should prioritize:

```text
Finding resources
Understanding categories
Reading metadata
Understanding how to request or access a resource
```

Do not optimize for visual spectacle.

---

# 35. Repository Layout

Desktop example:

```text
┌───────────────────────────────────────────────────────────┐
│ Repository                                                │
│ Search institutional files and reports                   │
├───────────────────────────────────────────────────────────┤
│ Search                                                    │
├───────────────┬───────────────────────────────────────────┤
│ Filters       │ Results                                   │
│               │                                           │
│ Section       │ Resource row                              │
│ Year          │ Resource row                              │
│ File Type     │ Resource row                              │
│ Campus        │ Resource row                              │
│               │ Resource row                              │
└───────────────┴───────────────────────────────────────────┘
```

---

# 36. Search Bar

The search interface should look like an information retrieval tool.

Avoid huge rounded search bars floating in the center of the page.

Use:

```text
Moderate border radius
Visible label
Search icon
Strong focus state
Clear placeholder
```

Example:

```text
Search repository
────────────────────────────────
Search reports, documents, files…
```

---

# 37. Filters

Desktop filters should preferably appear as a structured left column or compact horizontal toolbar.

Use headings such as:

```text
Reporting Year
Section
Resource Type
Campus
College
Program
```

Use checkboxes, select controls, or structured lists.

Avoid excessive filter chips.

---

# 38. Resource Presentation

Primary repository results should favor **rows or document records** over giant cards.

Example:

```text
┌──────────────────────────────────────────────────────────────┐
│ PDF                                                          │
│ Annual Financial Performance Report                          │
│ Financial Performance · 2026                                 │
│                                                              │
│ 3.4 MB       Uploaded Aug 2026            Public metadata only │
└──────────────────────────────────────────────────────────────┘
```

This resembles an institutional catalog.

---

# 39. Resource Row Anatomy

Each resource should clearly display:

```text
File type
Document title
Category
Year
File size
Upload date
Relevant metadata
Clear public availability note
```

Information hierarchy matters more than decoration.

---

# 40. File Type Identification

Avoid using giant colored cards for file types.

Instead use:

```text
Small file icon
Compact type label
Subtle semantic accent
```

Examples:

```text
PDF
IMG
File
```

These can appear inside narrow outlined rectangles.

---

# 41. Document Status Labels

Use minimal labels when needed.

Example:

```text
PDF
2026
Main Campus
```

Badges should be:

```text
Small
Rectangular
Low saturation
Limited in quantity
```

Avoid large colorful pills.

---

# 42. Card Philosophy

Cards are allowed, but should not become the foundation of every layout.

Use cards when they represent actual conceptual containers.

Good:

```text
Major repository section
Dashboard statistic
Preview panel
Upload area
```

Bad:

```text
Every paragraph
Every navigation item
Every file attribute
Every button
```

---

# 43. Border Radius

Use moderate radius.

Recommended:

```text
4px
6px
8px
10px
```

Maximum common surface:

```text
12px
```

Avoid:

```text
20px
24px
32px
fully rounded card containers
```

unless the component genuinely requires it.

The interface should feel structured rather than bubbly.

---

# 44. Borders

Borders are important.

Use thin neutral borders to define structure.

Example:

```text
1px solid soft neutral
```

Strong green borders should be reserved for active or highlighted states.

Separators can often replace cards.

---

# 45. Shadows

Use shadows minimally.

Recommended:

```text
Very subtle elevation for dropdowns
Dialogs
Sticky header
Preview overlays
```

Repository cards and sections should mostly rely on:

```text
Borders
Surface contrast
Spacing
```

rather than shadows.

---

# 46. Avoid Floating UI

Avoid making the whole interface appear to float above the page.

Generic AI layouts frequently use:

```text
floating cards
large shadows
rounded containers
blurred backgrounds
```

This system should feel anchored.

---

# 47. Spacing System

Whitespace is essential.

Spacing should create rhythm comparable to a formal report.

Suggested base:

```text
4px
8px
12px
16px
24px
32px
48px
64px
80px
```

Large institutional sections should use generous vertical spacing.

Resource rows should remain reasonably dense.

---

# 48. Information Density

The public repository should support moderate information density.

Do not create excessively oversized components that force users to scroll unnecessarily.

Desktop repository screens should be able to display several resources at once.

This is an information system.

Efficiency matters.

---

# 49. Section Divider Style

Use horizontal rules as intentional visual elements.

For example:

```text
SECTION A
────────────────────────────────────────────
Statistical Profile
```

A thin green rule may emphasize major sections.

This report-inspired structure can become part of the site's visual identity.

---

# 50. Vertical Green Rail

A recurring distinctive element may be a thin green rail on the left side of important headings.

Example:

```text
▌ Statistical Profile
```

This should be subtle.

It can be used for:

```text
Major page sections
Resource groups
Admin panel headings
Important context panels
```

Do not place it on every small element.

---

# 51. Institutional Numbering

Where content belongs to defined PDO categories, preserve numbering.

Examples:

```text
A.1
A.2
A.3
A.4
B.1
B.2
B.3
B.4
```

This reinforces the repository's organizational logic.

Do not replace meaningful institutional numbering with generic icons.

---

# 52. Iconography

Use Lucide icons selectively.

Icons should clarify actions.

Appropriate:

```text
Search
Download
Upload
File
Folder
Image
Log out
Delete
Edit
Filter
Calendar
Chevron
External link
```

Avoid decorative icons beside every heading.

---

# 53. Icon Style

Icons should usually use:

```text
16px
18px
20px
```

Larger icons should only be used in empty states or important feature blocks.

Avoid giant icons inside colorful circles.

---

# 54. Button Design

Primary buttons:

```text
Deep CPSU green background
White text
Moderate radius
Clear label
Minimal shadow
```

Example:

```text
[ Upload Resource ]
```

Secondary buttons:

```text
Neutral surface
Thin border
Dark text
```

Tertiary actions:

```text
Text or icon + text
```

---

# 55. Button Hierarchy

Do not make every action green.

Example:

```text
Primary:
Upload Resource

Secondary:
Preview

Tertiary:
Download

Destructive:
Delete
```

The page should clearly communicate the most important action.

---

# 56. Destructive Actions

Delete buttons should not use CPSU green.

Use restrained red only for destructive actions.

Delete confirmation dialogs should remain visually serious.

---

# 57. Form Design

Forms should resemble professional administrative forms.

Use:

```text
Labels above inputs
Clear helper text
Consistent field width
Visible validation
Logical grouping
Section separators
```

Do not rely solely on placeholders as labels.

---

# 58. Upload Form

The upload form should be structured like document registration.

Possible fields:

```text
Resource File
Display Name
Repository Section
Category
Year
Campus
College
Program
```

Only show relevant fields.

---

# 59. Upload Drop Zone

If drag-and-drop is supported, the drop zone should be restrained.

Avoid enormous dashed boxes occupying most of the screen.

Example:

```text
┌─────────────────────────────────────────────┐
│ Upload institutional resource              │
│                                             │
│ Drop a PDF or image here                  │
│ or choose a file                           │
│                                             │
│ Maximum file size: 25 MB                   │
└─────────────────────────────────────────────┘
```

---

# 60. Tables

Use tables where data is genuinely tabular.

The admin resource manager is a strong candidate.

Example columns:

```text
Resource
Section
Year
Type
Size
Uploaded
Actions
```

Tables should have:

```text
Clear headers
Soft row separators
Hover state
Responsive fallback
Keyboard accessibility
```

---

# 61. Table Styling

Avoid:

```text
Heavy grid lines
Alternating bright colors
Rounded card around every row
```

Prefer:

```text
Light header background
Subtle horizontal separators
Strong text hierarchy
```

---

# 62. Admin Dashboard Philosophy

The admin area should feel like an extension of the institutional repository, not a different SaaS product.

Maintain:

```text
Same green identity
Same typography
Same border language
Same spacing
Same file labels
```

The admin dashboard may be slightly denser.

---

# 63. Admin Layout

Recommended desktop structure:

```text
┌──────────────┬────────────────────────────────────────────┐
│              │ Top context bar                            │
│ Admin        ├────────────────────────────────────────────┤
│ Navigation   │                                            │
│              │ Main admin workspace                       │
│ Dashboard    │                                            │
│ Resources    │                                            │
│ Upload       │                                            │
│ Settings     │                                            │
│              │                                            │
└──────────────┴────────────────────────────────────────────┘
```

A sidebar is appropriate here because administrator workflows are application-like.

---

# 64. Admin Sidebar

The sidebar should use a restrained green/neutral composition.

Possible:

```text
Dark green sidebar
Light text
Muted secondary navigation
Small CPSU mark
```

or:

```text
Light sidebar
Dark green headings
Green active marker
```

Do not make it look like a generic shadcn dashboard sidebar.

Include project-specific language and repository structure.

---

# 65. Sidebar Active State

Preferred:

```text
Thin green vertical marker
Slight green-tinted background
Stronger text
```

Avoid large pill-shaped active items.

---

# 66. Dashboard Statistics

Statistics may use compact metric panels.

Example:

```text
TOTAL RESOURCES
────────────────
248

PDF       126
Images     44
```

Use typography and dividers rather than generic giant metric cards.

---

# 67. Dashboard Data Visualization

Do not add charts solely to make the dashboard look impressive.

Charts should exist only if they provide useful information.

Useful possibilities:

```text
Files by section
Storage distribution
Resources by year
File type distribution
```

Avoid decorative charts without administrative value.

---

# 68. Empty States

Empty states should be calm.

Example:

```text
No resources found

There are currently no files matching the selected
repository filters.

Clear filters
```

Avoid cartoon illustrations unless specifically commissioned.

---

# 69. Loading States

Use understated skeletons.

Skeleton shapes should match actual interface structure.

Avoid shimmering entire screens excessively.

For resource lists:

```text
Title line
Metadata line
Action placeholders
```

---

# 70. Error States

Errors should use clear language.

Example:

```text
Repository temporarily unavailable

We could not retrieve the requested resources.
Please try again.
```

Do not display raw technical errors to public users.

---

# 71. Notification Design

Toast notifications should be compact.

Example:

```text
✓ Resource uploaded successfully.
```

Use green for success.

Use red for destructive failures.

Avoid oversized animated notification banners.

---

# 72. Modal Dialogs

Dialogs should remain structured and serious.

Examples:

```text
Delete resource
Replace resource
Session expired
Upload confirmation
```

Do not add decorative illustrations.

---

# 73. Administrator PDF Preview

PDF preview is available only inside the authenticated administrator
interface. It should resemble a document-reading workspace.

Possible layout:

```text
Document title
Metadata
────────────────────────────────────────────
PDF viewing area
────────────────────────────────────────────
Download
Open separately
```

Avoid surrounding the PDF with unnecessary cards.

---

# 74. Administrator Image Preview

Image preview is available only inside the authenticated administrator
interface and should use:

```text
Neutral canvas
Centered image
Resource metadata
Staff download action
```

The image itself should remain the focus.

---

# 75. Legacy File Handling

Public legacy-file rows should remain metadata-only. In the authenticated
administrator interface, non-previewable files may use the standard resource
row with a staff download action. Do not add a simulated preview.

---

# 76. Breadcrumbs

Breadcrumbs are valuable for repository navigation.

Example:

```text
Repository
/
Statistical Profile
/
Student Population
/
2026
```

Use subtle typography.

Do not render each breadcrumb segment as a pill.

---

# 77. Search Results Count

Provide contextual information:

```text
42 resources
```

or:

```text
42 resources found for "accreditation"
```

This reinforces the repository/catalog feel.

---

# 78. Repository Grouping

Resources may be grouped by year or category.

Example:

```text
2026
──────────────────────────────────────────
Resource
Resource
Resource

2025
──────────────────────────────────────────
Resource
Resource
```

This can be more useful than endlessly repeated cards.

---

# 79. Major Section Landing Pages

Major sections such as Statistical Profile should behave like indexes.

Example:

```text
STATISTICAL PROFILE

A.1 Student Population
    18 resources
    Latest: 2026

A.2 Student Profile
    12 resources
    Latest: 2026

A.3 Human Resources
    14 resources
    Latest: 2026

A.4 Faculty-to-Student Ratio
    6 resources
    Latest: 2026
```

This is strongly tied to the actual project structure and prevents generic design.

---

# 80. Public vs Admin Identity

Public website:

```text
Editorial
Institutional
Document-oriented
Metadata-only
Readable
```

Admin interface:

```text
Structured
Dense
Operational
Efficient
Controlled
```

They must still visually belong to the same system.

---

# 81. Mobile Design

Do not simply shrink the desktop layout.

On mobile:

```text
Navigation collapses
Sidebar becomes drawer
Filters become filter panel
Tables become structured rows
Actions remain reachable
Metadata stacks logically
```

---

# 82. Mobile Resource Row

Example:

```text
PDF

Annual Financial Performance Report

Financial Performance
2026 · 3.4 MB

Public metadata only
```

Do not compress desktop columns until they become unreadable.

---

# 83. Mobile Header

Keep institutional identity visible without consuming excessive space.

Possible:

```text
CPSU logo
PDO Information Hub
Menu
```

The full university name may appear inside the opened navigation or secondary header.

---

# 84. Responsive Spacing

Desktop sections:

```text
48–80px vertical spacing
```

Tablet:

```text
40–64px
```

Mobile:

```text
28–48px
```

Resource lists should remain denser.

---

# 85. Animation Philosophy

Animations should be nearly invisible.

Use animation only to improve understanding.

Good:

```text
Menu opening
Dropdown
Accordion
Dialog
Filter panel
Small hover transitions
```

Avoid:

```text
Scroll reveals everywhere
Parallax
Floating objects
Animated gradients
Repeated bouncing icons
Cursor effects
Page transition spectacles
```

---

# 86. Transition Timing

Prefer:

```text
120ms–200ms
```

for simple controls.

Maybe:

```text
200ms–280ms
```

for dialogs or drawers.

Do not make administrative operations feel slow because of decorative transitions.

---

# 87. Hover States

Hover should communicate interactivity.

Examples:

```text
Slight background tint
Border strengthening
Text color shift
Underlining
```

Avoid dramatic scale effects.

---

# 88. Focus States

Keyboard focus must be obvious.

Use:

```text
Green focus ring
High contrast
Consistent offset
```

Never remove focus outlines without replacement.

---

# 89. Accessibility

Design must support:

```text
Keyboard navigation
Screen readers
Semantic HTML
High contrast
Visible focus
Readable typography
Accessible forms
Reduced motion
Descriptive links
```

Do not sacrifice accessibility for visual cleanliness.

---

# 90. Unique Visual Motif: Archive Tabs

One project-specific motif may be inspired by physical filing tabs.

Major sections could use subtle rectangular tabs such as:

```text
[A] Statistical Profile

[B] Higher Education Performance

[C] Research & Extension

[D] Financial Performance
```

These tabs should feel like archive indexes.

They should not become colorful app tabs.

Use:

```text
Green
Dark neutral
Soft neutral
```

---

# 91. Unique Visual Motif: Report Rules

Horizontal rules inspired by institutional reports may be used throughout the interface.

Example:

```text
A. STATISTICAL PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

or a thin version.

This helps the website feel connected to formal documentation.

---

# 92. Unique Visual Motif: Metadata Columns

Instead of generic cards, document metadata may be aligned in compact columns.

Example:

```text
YEAR          TYPE          SIZE          UPDATED
2026          PDF           3.4 MB        Aug 2026
```

This is especially appropriate for resource detail pages.

---

# 93. Unique Visual Motif: Section Index Number

Large but subtle section identifiers may appear in backgrounds.

Example:

```text
A.1
```

displayed at low contrast beside the page heading.

Use sparingly.

Avoid turning them into huge decorative typography everywhere.

---

# 94. Unique Visual Motif: Green Reference Line

A thin green line can act as the visual thread throughout the system.

It may appear:

```text
Under institutional headings
Beside active categories
Above page titles
Inside navigation states
Above footer sections
```

This becomes more distinctive than relying on gradient backgrounds.

---

# 95. Do Not Create the Generic "Three Feature Cards" Section

Avoid:

```text
[Icon]
Easy Access

[Icon]
Secure Storage

[Icon]
Fast Search
```

unless these represent real actionable areas.

Instead, show the actual repository sections.

Example:

```text
A
Statistical Profile

B
Higher Education Performance

C
Research & Extension

D
Financial Performance
```

---

# 96. Do Not Use Fake Metrics

Never place:

```text
10K+ Documents
99.9% Reliability
500+ Users
```

unless those values are derived from actual system data.

---

# 97. Do Not Use Fake Testimonials

This is an institutional repository.

Do not create:

```text
"What our users say"
```

unless there is an actual institutional requirement.

---

# 98. Do Not Use Generic AI Copy

Avoid text such as:

```text
Empowering excellence through innovation.

Transforming data into meaningful insights.

Unlock the power of institutional intelligence.

Your all-in-one solution for smarter planning.
```

These phrases weaken the institutional identity.

Use specific language.

Example:

```text
Access Planning and Development Office reports,
statistics, institutional performance documents,
and supporting resources.
```

---

# 99. Do Not Overuse Rounded Pills

Pill UI should be reserved for:

```text
Small statuses
Very compact filters
Tags where semantically appropriate
```

Do not use pills for:

```text
Navigation
Every button
Every file type
Every heading
Every metadata field
```

---

# 100. Do Not Overuse Gradients

The default design should contain **no major decorative gradient**.

If a gradient is ever introduced, it must have a functional or subtle branding purpose.

Solid green is stronger and more institutional.

---

# 101. Do Not Use Glassmorphism

Avoid:

```text
backdrop-blur
transparent glass cards
frosted navigation
floating glass dialogs
```

unless there is a very specific design reason.

The visual system should feel substantial and reliable.

---

# 102. Do Not Use Neumorphism

Avoid soft extruded surfaces.

They reduce accessibility and do not fit the institutional theme.

---

# 103. Avoid Template-Looking Landing Pages

The site should never follow the generic sequence:

```text
Navbar
Hero
3 feature cards
Statistics
Testimonials
CTA
Footer
```

Instead, the structure should follow the actual information architecture of the Planning and Development Office.

---

# 104. Content Is the Design

The strongest source of visual identity should be the actual PDO information structure.

Examples:

```text
A.1 Student Population
A.2 Student Profile
A.3 Human Resources
A.4 Faculty-to-Student Ratio

B.1 Certificate of Program Compliance
B.2 Accreditation
B.3 Licensure Examination Performance
B.4 Graduate Employability
```

These sections should shape navigation, typography, page indexes, and repository organization.

The design should emerge from the institution's content rather than being placed on top of it.

---

# 105. Footer

The footer should be formal.

Possible contents:

```text
CPSU seal
Central Philippines State University
Planning and Development Office

Information Hub

Repository
About
Contact

Official contact details
Copyright information
```

Use official information only when supplied.

---

# 106. Footer Visual Treatment

A deep green footer is appropriate.

Use:

```text
Deep green
White typography
Muted light-green separators
```

Do not overload the footer with dozens of links.

---

# 107. Branding Hierarchy

The visual hierarchy should be:

```text
Central Philippines State University
        ↓
Planning and Development Office
        ↓
Information Hub
```

The website must feel like a CPSU office system, not an independent commercial product called "Information Hub."

---

# 108. Logo Usage

Use only the official CPSU logo/seal supplied or approved for the project.

Do not:

```text
Redesign the university seal
Generate an AI version
Change its colors
Add effects
Add unnecessary shadows
Crop important elements
```

Provide enough clear space around official branding.

---

# 109. Image Usage

If official campus/office photography is available, it may be used carefully.

Good use:

```text
Home introduction
About page
Institutional banner
Office information
```

Avoid generic stock photography of:

```text
People typing laptops
Business teams
Abstract offices
Random graduates
```

Real CPSU imagery is preferable.

---

# 110. Photography Treatment

Photos should feel documentary rather than commercial.

Avoid heavy filters.

Use:

```text
Natural imagery
Consistent cropping
Subtle tonal treatment
```

Green overlays should be minimal if used at all.

---

# 111. Accessibility Contrast

Green backgrounds must use sufficiently contrasting foreground colors.

Do not use medium green with low-contrast gray text.

Do not use pale green text on white.

Always prioritize readability.

---

# 112. Dark Mode

Dark mode is not required for Version 1.

Do not implement dark mode simply because modern dashboards often include it.

The institutional light interface should be the priority.

If dark mode is introduced later, it must be intentionally designed rather than mechanically inverted.

---

# 113. Density Modes

Do not build density customization in Version 1.

Use a balanced density optimized for office desktop users.

---

# 114. Page Templates

## Standard Institutional Page

```text
Breadcrumb
Section identifier
Page title
Short description
Thin divider
Content
```

---

## Repository Listing Page

```text
Breadcrumb
Page heading
Search
Filters
Result count
Resource list
Pagination/loading mechanism
```

---

## Administrator Resource Detail Page

```text
Breadcrumb
File type
Resource title
Institutional metadata
Preview
Staff download
Related resources if available
```

---

## Admin List Page

```text
Page heading
Primary action
Search/filter tools
Resource table
Pagination/loading
```

---

## Admin Form Page

```text
Breadcrumb/back action
Page heading
Description
Structured form
Validation
Primary action
Secondary cancel action
```

---

# 115. Border and Surface Tokens

Suggested conceptual tokens:

```text
surface-page
surface-primary
surface-secondary
border-subtle
border-strong
border-active
```

Keep the system centralized through CSS variables or Tailwind theme configuration.

Do not scatter arbitrary colors throughout components.

---

# 116. Green Tokens

Recommended conceptual tokens:

```text
cpsu-green-950
cpsu-green-900
cpsu-green-800
cpsu-green-700
cpsu-green-100
cpsu-green-50
```

The exact hex values should eventually be replaced with verified official CPSU digital colors if available.

---

# 117. Semantic Tokens

Define:

```text
background
foreground
muted
muted-foreground
primary
primary-foreground
border
input
ring
success
warning
danger
```

Components should consume semantic tokens rather than directly embedding arbitrary colors.

---

# 118. Design Token Rule

Avoid code such as:

```text
bg-green-700
text-green-900
border-green-500
```

scattered across dozens of files.

Prefer centralized semantic styling.

Example:

```text
bg-primary
text-primary-foreground
border-border
```

Where appropriate, expose CPSU-specific design tokens.

---

# 119. Consistency Rule

If two components perform the same role, they should visually behave the same.

Examples:

```text
Buttons
Inputs
Filters
Resource rows
Section headings
Metadata labels
Dialogs
Empty states
```

Avoid one-off styling without purpose.

---

# 120. Visual Quality Checklist

Before approving a page, ask:

```text
Does this look specific to CPSU?

Does the page reflect the actual PDO information structure?

Does green feel intentional rather than excessive?

Does the layout prioritize information?

Could this easily be mistaken for a generic SaaS template?

Are there too many cards?

Are there too many pills?

Are gradients being used unnecessarily?

Are icons being used decoratively?

Is the spacing consistent?

Is the typography formal and readable?

Does the interface still work without animation?

Are metadata and document relationships easy to understand?

Does the page feel like an institutional repository?
```

If the page could be relabeled as an unrelated startup application without changing its structure, the design is too generic.

---

# 121. AI-Generated Design Detection Checklist

Reject a design direction if several of these appear:

```text
Huge gradient hero
Blurred green glowing circles
Glass cards
Twenty-pixel border radii everywhere
Every item placed in a card
Every button rendered as a pill
Generic feature grids
Floating dashboards inside hero sections
Fake analytics
Fake testimonials
Random charts
Gradient text
Excessive icon bubbles
Decorative sparkle icons
Unnecessary animations
Generic marketing language
Random purple or cyan accents
```

The site should look designed by understanding the institution, not generated from the prompt:

> "Create a modern green admin dashboard."

---

# 122. Desired Emotional Response

Public visitors should feel:

```text
This is official.
This is organized.
I understand where information belongs.
I can find the document I need.
This looks maintained.
This feels trustworthy.
```

Administrators should feel:

```text
I know where files go.
I can understand the repository structure.
I can manage documents efficiently.
Actions are predictable.
The interface does not distract me.
```

---

# 123. Design Signature

The CPSU PDO Information Hub should be recognizable through the combination of:

```text
Deep institutional green
Warm neutral surfaces
Structured document layouts
Section numbering
Archive-inspired tabs
Thin green reference lines
Formal typography
Moderate information density
Strong metadata presentation
Minimal card usage
Minimal decoration
Actual PDO repository taxonomy
```

No single visual trick defines the identity.

The identity comes from the complete system.

---

# 124. Final Visual Direction

The final website should feel like:

> **A modern digital institutional archive created specifically for the Central Philippines State University Planning and Development Office.**

It should combine:

```text
The structure of an academic report
The usability of a modern repository
The clarity of a library catalog
The authority of an institutional portal
The visual identity of CPSU
```

without becoming visually old-fashioned.

---

# 125. Final Design Rule

When choosing between:

```text
Trendiness vs clarity
```

choose:

```text
Clarity
```

When choosing between:

```text
Decoration vs institutional identity
```

choose:

```text
Institutional identity
```

When choosing between:

```text
Generic dashboard conventions vs PDO-specific structure
```

choose:

```text
PDO-specific structure
```

When choosing between:

```text
More visual effects vs stronger information hierarchy
```

choose:

```text
Stronger information hierarchy
```

When choosing between:

```text
A design that looks impressive in a screenshot
vs
a design that remains useful for years
```

choose:

```text
Long-term usefulness
```

---

# 126. Final Design Statement

The CPSU Planning and Development Office Information Hub must **not look like a green version of a generic admin template**.

Its visual language should come directly from:

```text
CPSU institutional identity
Planning and Development Office functions
Repository organization
Formal documents
Statistical reports
Academic performance records
Structured institutional information
```

Green is the primary branding color, but **structure, typography, hierarchy, and repository organization are the true design identity**.

The interface should remain professional enough for official university use, distinctive enough to be recognized as a CPSU system, simple enough for staff to operate comfortably, and maintainable enough to remain visually appropriate for many years.
