import { ApartmentOutlined, BranchesOutlined, CalendarOutlined, DashboardFilled, DashboardTwoTone, DashOutlined, ExceptionOutlined, FileSyncOutlined, SafetyCertificateOutlined, SubnodeOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { CalendarMonthOutlined, Dashboard, DashboardCustomizeOutlined, DashboardCustomizeSharp, DashboardOutlined, DocumentScannerTwoTone, FolderCopyOutlined, MapsHomeWorkTwoTone, Task, TypeSpecimen } from "@mui/icons-material";
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
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
    name: "document",
    list: "/document",
    create: "/document/create",
    edit: "/document/edit/:id",
    show: "/document/show",
    meta: {
      canDelete: true,
      label: 'Documentos',
      icon: <ReceiptLongIcon/>
      
    },
  },
  {
    name: "calendario",
    list: "/calendario",
    show: "/conditions/show",
    meta: {
      canDelete: true,
      label: 'Calendario',
      icon: <CalendarMonthOutlined />
    },
  },
  {
    name: "maps",
    list: "/mapsall",
    create: "/maps/create",
    edit: "/maps/edit/:id",
    show: "/maps/show",
    meta: {
      canDelete: true,
      label: 'Maps',
      icon: <AddLocationAltIcon />
    },
  },
  {
    name: "task",
    list: "/task",
    create: "/task/create",
    edit: "/task/edit/:id",
    show: "/task/show",
    meta: {
      canDelete: true,
      label: 'Task',
      icon: <Task />
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
    edit: "/adm/users/edit/:id",
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
    create: "/documents/conditionals",
    meta: {
      parent: "documents",
      label: "Condição",
      icon: <SafetyCertificateOutlined />
    }
  }


]