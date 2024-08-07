import { ApartmentOutlined, BranchesOutlined, DashboardFilled, DashboardTwoTone, DashOutlined, FileSyncOutlined, SafetyCertificateOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { Dashboard, DashboardCustomizeOutlined, DashboardCustomizeSharp, DashboardOutlined, DocumentScannerTwoTone, FolderCopyOutlined, TypeSpecimen } from "@mui/icons-material";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NewReleasesOutlinedIcon from '@mui/icons-material/NewReleasesOutlined';
import MoreOutlinedIcon from '@mui/icons-material/MoreOutlined';
import type { IResourceItem } from "@refinedev/core";

export const resources: IResourceItem[] = [
  {
    name: "blog_posts",
    list: "/blog-posts",
    create: "/blog-posts/create",
    edit: "/blog-posts/edit/:id",
    show: "/blog-posts/show/:id",
    meta: {
      canDelete: true,
      label: 'Painel',
      icon: <DashboardFilled/>
    },
  },
  {
    name: "categories",
    list: "/categories",
    create: "/categories/create",
    edit: "/categories/edit/:id",
    show: "/categories/show/:id",
    meta: {
      canDelete: true,
      label: 'Documentos',
      icon: <ReceiptLongIcon/>
    },
  },
  {
    name: "administrations",
    list: "/adm",
    show: "/adm",
    meta:{
      label: "Administração",
      icon: <ApartmentOutlined />
    }
  },
  {
      name: "administrations",
      list: "/adm/company",
      meta: {
          parent: "administrations",
          label: "Empresa",
          icon: <AddBusinessIcon/>
      },
  },
  {
    name: "bracnhs",
    list: "/adm/branch",
    meta: {
      parent: "administrations",
      label: "Filial",
      icon: <BranchesOutlined/>
    }
  },
  {
    name: "Usuarios",
    show: "/adm/users",
    list: "/adm/users/list",
    create: "/adm/users/create",
    meta: {
      parent: "administrations",
      label: "Usuários",
      icon: <UserSwitchOutlined/>
    }
  },
  {
    name: "documents",
    show: "/documents",
    list: "/documents",
    meta: {
      label: "Documentação",
      icon: <FolderCopyOutlined />
    }
  },
  {
    name: "/type-documents",
    show: "/documents/type-documents",
    list: "/documents/type-documents",
    meta: {
      parent: "documents",
      label: "Tipo Documento",
      icon: <FileSyncOutlined />
    }
  },
  {
    name: "/coditionals",
    show: "/documents/conditionals",
    list: "/documents/conditionals",
    meta: {
      parent: "documents",
      label: "Condição",
      icon: <SafetyCertificateOutlined />
    }
  }


]