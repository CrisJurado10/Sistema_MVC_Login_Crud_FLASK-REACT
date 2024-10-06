from flask import Blueprint
from controllers.user_controller import get_users, create_user, update_user, delete_user

user_bp = Blueprint('user_bp', __name__)

user_bp.route('/users', methods=['GET'])(get_users)
user_bp.route('/users', methods=['POST'])(create_user)
user_bp.route('/users/<int:user_id>', methods=['PUT'])(update_user)
user_bp.route('/users/<int:user_id>', methods=['DELETE'])(delete_user)
