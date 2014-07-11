from django.db import models
from jsDesigner.service.diagramJSONAssembler import JSONField
import uuid

class Diagram(models.Model):

    code = models.CharField(blank=False, null=False, max_length=200)
    description = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    """Information graphique  ( labels, etc... ) """
    info = JSONField(default={})
    smUUID = models.CharField( max_length=32, null=True, blank=True, editable=False)

    def as_json(self):
        return dict(
            id=self.pk,
            code=self.code,
            smUUID=self.smUUID)
        
    def save(self, *args, **kwargs):
        if not self.smUUID:
            self.smUUID = uuid.uuid1().hex

        super(Diagram, self).save(*args, **kwargs)