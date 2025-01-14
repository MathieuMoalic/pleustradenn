import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "a3eaf8d6e0c1"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Step 1: Create a new table with the updated schema
    op.create_table(
        "item_temp",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False, unique=True, index=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, index=True, default=False),
        sa.Column("notes", sa.String(), nullable=True),
        sa.Column("quantity", sa.Float(), nullable=True),  # Updated column type
        sa.Column("unit", sa.String(), nullable=True),
        sa.Column("category_id", sa.Integer(), nullable=False),
    )

    # Step 2: Copy data from the old table to the new table
    op.execute("""
        INSERT INTO item_temp (id, name, is_active, notes, quantity, unit, category_id)
        SELECT id, name, is_active, notes, quantity, unit, category_id
        FROM item
    """)

    # Step 3: Drop the old table
    op.drop_table("item")

    # Step 4: Rename the new table to the old table's name
    op.rename_table("item_temp", "item")

    op.create_table(
        "user",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("username", sa.String(), nullable=False, unique=True, index=True),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column("disabled", sa.Boolean(), nullable=False, default=False),
    )


def downgrade() -> None:
    # Step 1: Create the original table structure
    op.create_table(
        "item_temp",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False, unique=True, index=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, index=True, default=False),
        sa.Column("notes", sa.String(), nullable=True),
        sa.Column("quantity", sa.Integer(), nullable=True),  # Revert to original type
        sa.Column("unit", sa.String(), nullable=True),
        sa.Column("category_id", sa.Integer(), nullable=False),
    )

    # Step 2: Copy data from the current table to the old table
    op.execute("""
        INSERT INTO item_temp (id, name, is_active, notes, quantity, unit, category_id)
        SELECT id, name, is_active, notes, CAST(quantity AS INTEGER), unit, category_id
        FROM item
    """)

    # Step 3: Drop the current table
    op.drop_table("item")

    # Step 4: Rename the temp table back to the original name
    op.rename_table("item_temp", "item")

    op.drop_table("user")
