"""Video settings control panel registration."""

from plone.app.registry.browser.controlpanel import ControlPanelFormWrapper
from plone.app.registry.browser.controlpanel import RegistryEditForm
from plone.restapi.controlpanels import RegistryConfigletPanel
from sc.videos import _
from sc.videos.controlpanels.interfaces import ISCVideoSettings
from sc.videos.interfaces import IBrowserLayer
from zope.component import adapter
from zope.interface import Interface


class SettingsEditForm(RegistryEditForm):
    """Classic (non-REST) edit form for video settings."""

    schema = ISCVideoSettings
    schema_prefix = "video"
    label = "Video Settings"


class SettingsControlPanelFormWrapper(ControlPanelFormWrapper):
    """Wrapper that renders :class:`SettingsEditForm` inside the control panel."""

    form = SettingsEditForm


@adapter(Interface, IBrowserLayer)
class SettingsConfigletPanel(RegistryConfigletPanel):
    """REST API control-panel endpoint for video settings."""

    schema = ISCVideoSettings
    configlet_id = "video_settings"
    configlet_category_id = "Products"
    title = _("Video Settings")
    group = "Products"
    schema_prefix = "sc.videos"
