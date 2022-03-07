# Resource Description Framework design
The original design contains RDF handling, however, this has been simplified, such that each property does not have their own address, but is merely a part of the entity that is creating them. The property will then be available to all direct entity children of this entity.
Originally, the design also had all properties assigned to a class. This has now been removed.

## Organization (possibly)
It may be favorable to be able to create properties for grandchildren (and beyond) of an entity, and therefore, the properties could be assigned to a "class"/"organization" that an entity could then be assigned to. For now, this is out of scope.