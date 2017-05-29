import json
import genson


class SchemaGenerator:
    @staticmethod
    def generate_schema(data):
        schema = genson.Schema()
        schema.add_schema({})

        # To get rid of nasty type errors, pingpong forth and back to JSON compatible: JSON
        json_data = json.dumps(data)
        dictionary = json.loads(json_data)
        schema.add_object(dictionary)

        # Replace MongoDB-incompatible dot with unicode FULLWIDTH FULLSTOP
        schema_dict = schema.to_dict()
        for key, value in schema_dict['items']['properties'].items():
            if '.' in key:
                new_key = key.replace('.', '\uff0e')
                schema_dict['items']['properties'][new_key] = schema_dict['items']['properties'].pop(key)
        required_ = schema_dict['items']['required']

        for required_val in required_:
            if '.' in required_val:
                required_.append(
                    required_.pop(
                        required_.index(required_val)
                    ).replace('.', '\uff0e')
                )

        return schema_dict
