# Development Workflow

## Branch strategy
Primary migration branch contains integrated implementation.
Local branches for each major feature have been created in this working copy.

Planned feature branches:
- `feature/project-setup`
- `feature/sqlite-database`
- `feature/product-catalog`
- `feature/product-details`
- `feature/search-and-filters`
- `feature/cart`
- `feature/checkout`
- `feature/authentication`
- `feature/orders`
- `feature/profile`
- `feature/navigation-and-theme`
- `feature/testing-and-docs`

### Commands to push the prepared feature branches
Run from the migration branch after adding your remote updates:

```bash
git push -u origin feature/project-setup
git push -u origin feature/sqlite-database
git push -u origin feature/product-catalog
git push -u origin feature/product-details
git push -u origin feature/search-and-filters
git push -u origin feature/cart
git push -u origin feature/checkout
git push -u origin feature/authentication
git push -u origin feature/orders
git push -u origin feature/profile
git push -u origin feature/navigation-and-theme
git push -u origin feature/testing-and-docs
```
