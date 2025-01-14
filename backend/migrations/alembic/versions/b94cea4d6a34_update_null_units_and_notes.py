"""Update NULL units and notes

Revision ID: b94cea4d6a34
Revises: a3eaf8d6e0c1
Create Date: 2025-01-12 13:54:38.634281

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "b94cea4d6a34"
down_revision: Union[str, None] = "a3eaf8d6e0c1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Update NULL values
    op.execute("UPDATE item SET notes = '' WHERE notes IS NULL")
    op.execute("UPDATE item SET unit = 'None' WHERE unit IS NULL")

    # Create a new table with the updated schema
    op.create_table(
        "item_new",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, index=True, default=False),
        sa.Column("notes", sa.String(), nullable=False),  # Updated to NOT NULL
        sa.Column("quantity", sa.Float(), nullable=True),
        sa.Column("unit", sa.String(), nullable=False),  # Updated to NOT NULL
        sa.Column("category_id", sa.Integer(), nullable=False),
    )

    # Copy data from the old table to the new table
    op.execute("""
        INSERT INTO item_new (id, name, is_active, notes, quantity, unit, category_id)
        SELECT id, name, is_active, notes, quantity, unit, category_id FROM item
    """)

    # Drop the old table
    op.drop_table("item")

    # Rename the new table to the old table's name
    op.rename_table("item_new", "item")


def downgrade() -> None:
    # Create the old table schema
    op.create_table(
        "item_old",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, index=True, default=False),
        sa.Column("notes", sa.String(), nullable=True),  # Revert to nullable
        sa.Column("unit", sa.String(), nullable=True),  # Revert to nullable
        sa.Column("quantity", sa.Float(), nullable=True),
        sa.Column("category_id", sa.Integer(), nullable=False),
    )

    # Copy data back to the old table schema
    op.execute("""
        INSERT INTO item_old (id, name, is_active, notes, quantity, unit, category_id)
        SELECT id, name, is_active, notes, quantity, unit, category_id FROM item
    """)

    # Drop the current table
    op.drop_table("item")

    # Rename the old table back to the original name
    op.rename_table("item_old", "item")
