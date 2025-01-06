# finance_project/db_router.py

class FinanceAppRouter:
    """
    A router to control all database operations on models in the finance_app application.
    """
    route_app_labels = {'api_finance'}

    def db_for_read(self, model, **hints):
        """
        Attempts to read finance_app models go to finance_db.
        """
        if model._meta.app_label == 'api_finance':
            return 'finance_db'
        return 'default'

    def db_for_write(self, model, **hints):
        """
        Attempts to write finance_app models go to finance_db.
        """
        if model._meta.app_label  == 'api_finance':
            return 'finance_db'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if a model in the finance_app is involved.
        """
        if (
                obj1._meta.app_label  == 'api_finance' or
                obj2._meta.app_label  == 'api_finance'
        ):
            return True
        # Allow relations involving ContentType model
        if obj1._meta.model_name == 'contenttype' or obj2._meta.model_name == 'contenttype':
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Ensure that the finance_app's models get created on the finance_db.
        """
        if app_label  == 'api_finance':
            return db == 'finance_db'
        return None
