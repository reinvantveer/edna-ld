import genson


class SchemaGenerator:
    @staticmethod
    def generate_schema(data):
        schema = genson.Schema()
        schema.add_schema({})
        schema.add_object(data)
        return schema.to_dict()
