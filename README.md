Mercury
=======

Mercury for JIRA allows you to extend the functionality of JIRA, executing scripts to interact with JIRA as Post Functions. Scripts can take actions such as updating an issue during a transition.

Product status
--------------

Mercury Cloud is in development and will replace the Server product with JavaScript workflow scripts for Jira Cloud. See [the Cloud migration notes](cloud.md).

The Server documentation below describes the legacy product. Existing Server scripts do not run unchanged on Jira Cloud.

Getting started
---------------

### Development Setup

It is recommended to test your scripts on a development or staging environment before deploying them to production. To set up your own development environment you may follow the <a href="https://developer.atlassian.com/static/connect/docs/latest/guides/development-setup.html" target="_blank">Atlassian Development Setup</a> document.

### Installation

1. Log into your JIRA instance as an admin.
2. Click the admin dropdown and choose **Atlassian Marketplace**.
   * The Manage add-ons screen loads.
3. Click **Find new add-ons** from the left-hand side of the page.
4. Locate **Mercury for JIRA** via search.
   * The appropriate add-on version appears in the search results.
5. Click **Try free** to begin a new trial or **Buy now** to purchase a license for **Mercury for JIRA**.
   * You're prompted to log into MyAtlassian. Mercury for JIRA begins to download.
6. Enter your information and click **Generate license** when redirected to MyAtlassian.
7. Click **Apply license**.
   * If you're using an older version of UPM, you can copy and paste the license into your JIRA instance.

### Adding a script post function

To add a script post function to a transition, edit the workflow that contains the transition, select the transition, then click **Post functions** in the properties panel for the transition.

On the Post functions tab, you can see any post functions that have already been set. When you click Add post function you can choose **Script post function** from the list, and set the path of the script.

For more information see the <a href="https://confluence.atlassian.com/display/JIRA/Advanced+Workflow+Configuration#AdvancedWorkflowConfiguration-Postfunctions" target="_blank">configuring post functions</a> document.

Example
-------

### Set the issue fix version (integrating Gitlab with JIRA) 

Mercury provides you with the ability to set the fix version automatically when <a href="https://docs.gitlab.com/ee/project_services/jira.html#jira-issue-closing-example" target="_blank">closing issues with merge requests</a>. In this example NEXTBUILD may then be used to search and bulk update issues to the real fix version when your RC build has been promoted. *Depending on how your workflow is configured you may be required to <a href="https://confluence.atlassian.com/jira/allow-editing-of-closed-issues-138704.html" target="_blank">allow edits to issues when closed</a>.*

```groovy
import com.atlassian.jira.component.ComponentAccessor
def version = [ComponentAccessor.getVersionManager().getVersion(issue.getProjectObject().id, 'NEXTBUILD')]
issue.setFixVersions(version)
```

Privacy Policy
-------

### Privacy Policy

Your privacy is important to us. It is NWGG Pty Ltd's policy to respect your privacy regarding any information we may collect from you across our website, http://just.johno.it/mercury/, and other sites we own and operate.

We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.

We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorised access, disclosure, copying, use or modification.

We don’t share any personally identifying information publicly or with third-parties, except when required to by law.

Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.

You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.

Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.

Data Security and Privacy for Atlassian Plugins
-------

### Data Security and Privacy

NWGG Pty Ltd plugins for Atlassian products do not gather, collect, store, process or transmit any information about individuals nor do they process analytical or tracking information or make use of cookies.

### Atlassian Marketplace

Any personal information required for licensing and billing is collected and processed by Atlassian and is governed by the [Atlassian Marketplace Terms of Use](https://www.atlassian.com/licensing/marketplace/termsofuse). NWGG Pty Ltd has access to personal and billing information as part of the reporting and analytics features provided by Atlassian to Marketplace vendors.

This information can be used for analysis and improvement of the NWGG Pty Ltd products and services. It may also be used to contact you regarding product or service related topics, as you have listed yourself as a contact for the plugin at Atlassian’s Marketplace.

### Google Analytics

Google Analytics is used by Atlassian to collect usage information on the Atlassian Marketplace add-on listing pages. Any private information collected by Atlassian or third party partners on the Atlassian Marketplace website is governed by the [Atlassian Privacy Policy](https://www.atlassian.com/legal/privacy-policy). NWGG Pty Ltd does receive Google Analytics data from the Atlassian Marketplace website but has no control over their collection, storage and processing.

Terms of Service
-------

### NWGG Pty Ltd Terms of Service

* Terms

    * By accessing the website at http://just.johno.it/mercury/, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.

* Use License

    * Permission is granted to temporarily download one copy of the materials (information or software) on NWGG Pty Ltd's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        * modify or copy the materials;
        * use the materials for any commercial purpose, or for any public display (commercial or non-commercial);
        * attempt to decompile or reverse engineer any software contained on NWGG Pty Ltd's website;
        * remove any copyright or other proprietary notations from the materials; or
        * transfer the materials to another person or "mirror" the materials on any other server.

    * This license shall automatically terminate if you violate any of these restrictions and may be terminated by NWGG Pty Ltd at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.

* Disclaimer

    * The materials on NWGG Pty Ltd's website are provided on an 'as is' basis. NWGG Pty Ltd makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

    * Further, NWGG Pty Ltd does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.

* Limitations

    * In no event shall NWGG Pty Ltd or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on NWGG Pty Ltd's website, even if NWGG Pty Ltd or a NWGG Pty Ltd authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.

* Accuracy of materials

    * The materials appearing on NWGG Pty Ltd's website could include technical, typographical, or photographic errors. NWGG Pty Ltd does not warrant that any of the materials on its website are accurate, complete or current. NWGG Pty Ltd may make changes to the materials contained on its website at any time without notice. However NWGG Pty Ltd does not make any commitment to update the materials.

* Links

    * NWGG Pty Ltd has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by NWGG Pty Ltd of the site. Use of any such linked website is at the user's own risk.

* Modifications

    * NWGG Pty Ltd may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.

* Governing Law

    * These terms and conditions are governed by and construed in accordance with the laws of Canberra, Australia and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.

EULA for Atlassian Plugins
-------

This End User License Agreement (EULA) is a legal agreement between you (an individual or entity) and NWGG Pty Ltd.

By installing, copying or using any of the NWGG Pty Ltd Atlassian Apps (referred to as PLUGIN), you strictly agree to terms of this EULA.

This EULA is a supplement to the

* Atlassian Marketplace Terms of Use [Atlassian EULA](https://www.atlassian.com/licensing/marketplace/termsofuse)
* Privacy, Security & Cookie Statement [NWGG Pty Ltd Privacy Statement](http://just.johno.it/mercury/#mercury-data-security-and-privacy-for-atlassian-plugins)

By agreeing to the terms of this EULA, you also agree to all of the above.

If you do not agree with the EULA and its supplements, you must not install, copy or use the PLUGIN and must uninstall and remove any version or copy of it.

### Disclaimer of Warranty

THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM “AS IS” WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU. SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION.

### Limitation of Liability

IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MODIFIES AND/OR CONVEYS THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER PROGRAMS), EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

### Copyright Statement

All intellectual property rights of the PLUGIN and its documentation are and remain to be of NWGG Pty Ltd.
