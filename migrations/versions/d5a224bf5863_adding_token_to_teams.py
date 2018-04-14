"""Change theme from original to core

Revision ID: d5a224bf5863
Revises: d5a224bf5862
Create Date: 2018-1-1 00:00:00.00

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'd5a224bf5863'
down_revision = 'd5a224bf5862'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('teams', sa.Column('token', sa.String(length=64), nullable=True, default=0))
    sa.UniqueConstraint('token')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('teams', 'token')
    # ### end Alembic commands ###
